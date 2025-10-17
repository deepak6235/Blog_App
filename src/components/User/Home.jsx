import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import CenterLoader from "../CenterLoader";

const Home = () => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const isInitialMount = useRef(true);
  const searchTimeout = useRef(null);

    const API = import.meta.env.VITE_API;

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchHomeData = async (isInitial = false) => {
    if (isInitial) {
      setLoading(true);
    }
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login");
        navigate("/");
        return;
      }
  
      const params = new URLSearchParams();
      if (categoryFilter && categoryFilter !== "all")
        params.append("category", categoryFilter);
      if (fromDate && toDate) {
        params.append("fromDate", fromDate);
        params.append("toDate", toDate);
      }
      if (debouncedSearch.trim()) {
        params.append("search", debouncedSearch.trim());
      }
  
      const res = await axios.get(`${API}/homeData?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      });
  
      console.log("Response:", res.data);
  
      setProfile(res.data.profile);
      setBlogs(res.data.blogs);
      setFilteredBlogs(res.data.blogs);
      
      if (loading) {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching home data:", err);
      if (loading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 2000);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchHomeData(true); 
      return;
    }

    fetchHomeData(false); 
  }, [categoryFilter, fromDate, toDate, debouncedSearch]);

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      setDebouncedSearch(searchQuery);
    }
  };

  useEffect(() => {
    let updatedBlogs = [...blogs];

    if (categoryFilter !== "all") {
      updatedBlogs = updatedBlogs.filter(
        b => b.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (fromDate && toDate) {
      updatedBlogs = updatedBlogs.filter(b => {
        const blogDate = new Date(b.created_at);
        return blogDate >= new Date(fromDate) && blogDate <= new Date(toDate);
      });
    }

    setFilteredBlogs(updatedBlogs);
  }, [blogs, categoryFilter, fromDate, toDate]);

  const toggleLike = async blogId => {
    // Optimistic update
    let previousState;
    setBlogs(prev => {
      previousState = prev;
      return prev.map(blog => {
        if (blog.id !== blogId) return blog;
        const nextLiked = !blog.userLiked;
        return {
          ...blog,
          userLiked: nextLiked,
          likeCount: nextLiked ? (blog.likeCount || 0) + 1 : Math.max((blog.likeCount || 0) - 1, 0),
        };
      });
    });

    try {
      await axios.post(
        `${API}/like/toggle/${blogId}`,
        {},
        { ...getAuthConfig(), __skipGlobalLoading: true }
      );
      // no-op: server confirmed, UI already updated
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert on failure
      setBlogs(previousState);
    }
  };

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto">
        <CenterLoader label="Loading feed" variant="waves" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {profile.name || "User"}! 👋
            </h1>
            <p className="text-gray-600">Discover amazing stories and share your thoughts</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/user-profile")}
              className="btn btn-secondary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
            <button
              onClick={Logout}
              className="btn btn-error"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Categories</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="health">Health</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="input"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  className="input"
                />
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full px-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? null : filteredBlogs.length > 0 ? (
            filteredBlogs.map(blog => (
              <div key={blog.id} className="card group hover:scale-105 transition-all duration-300">
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  {blog.image ? (
                    <img
                      src={`${API}/uploads/${blog.image}`}
                      alt={blog.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                      {blog.category}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {blog.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <button
                      onClick={() => toggleLike(blog.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        blog.userLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <svg className={`w-4 h-4 ${blog.userLiked ? "fill-current" : ""}`} fill={blog.userLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {blog.likeCount || 0}
                    </button>
                    <span className="flex items-center gap-1 text-yellow-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {blog.avgRating?.toFixed(1) || 0}
                    </span>
                    <span className="flex items-center gap-1 text-blue-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {blog.commentCount || 0}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Read More Button */}
                  <button
                    onClick={() => navigate(`/blog-details/${blog.id}`)}
                    className="btn btn-primary w-full"
                  >
                    <span>Read More</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later for new content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;