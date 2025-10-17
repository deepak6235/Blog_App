import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import CenterLoader from "../CenterLoader";

const AdminHome = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
  const [category, setCategory] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); 
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedBlog, setSelectedBlog] = useState(null);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);



  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isInitialMount = useRef(true);
  const searchTimeout = useRef(null);


    const API = import.meta.env.VITE_API;

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 800);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!token) {
      alert("Please login");
      navigate("/", { replace: true });
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchAllData();
      return;
    }

    fetchAllData();
  }, [filter, category, fromDate, toDate, debouncedSearch]);

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      setDebouncedSearch(searchQuery);
    }
  };

  const Logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      let url = `${API}/homeData/all/data`;
      const params = new URLSearchParams();

      if (filter !== "all") params.append("stage", filter);
      if (category !== "all") params.append("category", category);
      if (fromDate && toDate) {
        params.append("fromDate", fromDate);
        params.append("toDate", toDate);
      }
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());

      if (params.toString()) url += `?${params.toString()}`;

      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setBlogs(res.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const viewLikes = (blog) => {
    setSelectedBlog(blog);
    setLikesModalOpen(true);
  };
  const viewComments = (blog) => {
    setSelectedBlog(blog);
    setCommentsModalOpen(true);
  };
  const viewReviews = (blog) => {
    setSelectedBlog(blog);
    setReviewsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="container mx-auto">
          <CenterLoader label="Loading blogs" variant="waves" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600">Manage and monitor all blog posts</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/admin-add-blog")}
              className="btn btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Blog
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
              {/* Stage Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="input"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="deleted">Deleted</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input"
                >
                  <option value="all">All Categories</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Health">Health</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Lifestyle">Lifestyle</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* Search */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title or description..."
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

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? null : blogs.length > 0 ? (
            blogs.map((blog) => (
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
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      blog.stage === 'published' ? 'bg-green-100 text-green-800' :
                      blog.stage === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      blog.stage === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {blog.stage}
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
                      onClick={() => viewLikes(blog)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      {blog.likeCount || 0}
                    </button>
                    <button
                      onClick={() => viewComments(blog)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {blog.commentCount || 0}
                    </button>
                    <button
                      onClick={() => viewReviews(blog)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {blog.avgRating?.toFixed(1) || 0}
                    </button>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin-update-blog/${blog.id}`)}
                      className="btn btn-secondary flex-1"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this blog post?")) {
                          try {
                            await axios.patch(`${API}/homeData/blog/${blog.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
                            setBlogs(blogs.filter((b) => b.id !== blog.id));
                          } catch (err) {
                            console.error("Error deleting blog:", err);
                          }
                        }
                      }}
                      className="btn btn-error"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or create a new blog post.</p>
              <button
                onClick={() => navigate("/admin-add-blog")}
                className="btn btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create First Blog
              </button>
            </div>
          )}
        </div>
      </div>


{/* ❤️ Likes Modal */}
{likesModalOpen && selectedBlog && (
  <div className="modal-overlay">
    <div className="modal-content likes-modal">
      <h3 className="modal-title">❤️ Likes</h3>

      {selectedBlog.likes && selectedBlog.likes.length > 0 ? (
        <ul className="likes-list">
          {selectedBlog.likes.map((like) => (
            <li key={like.user.id} className="like-item">
              <div
                className="like-user"
                onClick={() => navigate(`/admin-view-user/${like.user.id}`)}
              >
                <div className="avatar">
                  {like.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="like-username">{like.user.name}</span>
                  <p className="like-email">{like.user.email}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-likes">No likes yet.</p>
      )}

      <button className="close-btn" onClick={() => setLikesModalOpen(false)}>
        Close
      </button>
    </div>
  </div>
)}


{reviewsModalOpen && selectedBlog && (
  <div className="modal-overlay">
    <div className="modal-content reviews-modal">
      <h3 className="modal-title">
        Reviews (Avg: {selectedBlog.avgRating?.toFixed(1) || 0} / 5)
      </h3>

      {selectedBlog.reviews && selectedBlog.reviews.length > 0 ? (
        <ul className="reviews-list space-y-4">
          {selectedBlog.reviews.map((review) => (
            <li key={review.id} className="review-item border-b pb-3">
              {/* User info and rating */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className="review-user flex items-center cursor-pointer"
                  onClick={() => navigate(`/admin-view-user/${review.user.id}`)}
                >
                  <div className="avatar w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold mr-3">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="review-username font-semibold">
                      {review.user.name}
                    </span>
                    <span className="review-date text-gray-500 text-sm">
                      {new Date(review.reviewed_at).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="review-rating text-purple-600 font-semibold">
                  ⭐ {review.rating} / 5
                </div>
              </div>

              {/* Review text */}
              <p className="review-text text-gray-700 ml-[3.5rem]">{review.review}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-reviews text-gray-500">No reviews yet.</p>
      )}

      <button
        className="close-btn mt-4"
        onClick={() => setReviewsModalOpen(false)}
      >
        Close
      </button>
    </div>
  </div>
)}





{/* 💬 Comments Modal */}
{commentsModalOpen && selectedBlog && (
  <div className="modal-overlay">
    <div className="modal-content comments-modal">
      <h3 className="modal-title">💬 Comments</h3>

      {selectedBlog.comments && selectedBlog.comments.length > 0 ? (
        <ul className="comment-list">
          {selectedBlog.comments.map((comment) => (
            <li key={comment.id} className="comment-item">
              <div
                className="comment-header"
                onClick={() => navigate(`/admin-view-user/${comment.user.id}`)}
              >
                <div className="avatar">
                  {comment.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className="comment-username">{comment.user.name}</span>
                  <span className="comment-date">
                    {new Date(comment.commented_at).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <p className="comment-text">{comment.comment}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-comments">No comments yet.</p>
      )}

      <button className="close-btn" onClick={() => setCommentsModalOpen(false)}>
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminHome;