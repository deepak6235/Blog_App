import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CenterLoader from "../CenterLoader";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchOnceRef = useRef(false);

  const [blog, setBlog] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [userReview, setUserReview] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState([]);
  const [likesCount, setLikesCount] = useState({});
  const [newRating, setNewRating] = useState(0);
  const [newReview, setNewReview] = useState("");
  const [newComment, setNewComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const token = localStorage.getItem("token");
  const authConfig = { headers: { Authorization: `Bearer ${token}` } };


    const API = import.meta.env.VITE_API;


  const fetchAllData = async () => {
    if (!token) {
      alert("Please login");
      navigate("/");
      return;
    }

    try {
      const res = await axios.get(`${API}/homeData/${id}`, authConfig);
      const data = res.data;

      setBlog(data.blog);
      setReviews(data.reviews);
      setComments(data.comments);
      setUserReview(Array.isArray(data.userReview) ? data.userReview : [data.userReview]);
      setUserComments(Array.isArray(data.userComments) ? data.userComments : [data.userComments]);
      setLikedBlogs(data.likedBlogs || []);
      setLikesCount(data.likesCount || {});
    } catch (err) {
      console.error("Error fetching blog details:", err);
    }
  };

  useEffect(() => {
    if (!fetchOnceRef.current) {
      fetchAllData();
      fetchOnceRef.current = true;
    }
  }, [id]);

  const toggleLike = async (blogId) => {
    // Optimistic update
    const wasLiked = likedBlogs.includes(blogId);
    setLikedBlogs(prev => (wasLiked ? prev.filter(b => b !== blogId) : [...prev, blogId]));
    setLikesCount(prev => ({
      ...prev,
      [blogId]: wasLiked ? Math.max((prev[blogId] || 1) - 1, 0) : (prev[blogId] || 0) + 1,
    }));

    try {
      await axios.post(`${API}/like/toggle/${id}`, {}, { ...authConfig, __skipGlobalLoading: true });
      // no-op: confirmed by server
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert on failure
      setLikedBlogs(prev => (wasLiked ? [...prev, blogId] : prev.filter(b => b !== blogId)));
      setLikesCount(prev => ({
        ...prev,
        [blogId]: wasLiked ? (prev[blogId] || 0) + 1 : Math.max((prev[blogId] || 1) - 1, 0),
      }));
    }
  };

  const submitReview = async () => {
    if (!newRating || !newReview.trim()) return alert("Add rating and review!");
    try {
      await axios.post(`${API}/review/${id}`, { rating: newRating, review: newReview }, authConfig);
      setNewRating(0);
      setNewReview("");
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong while submitting review.");
      console.error(err);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`${API}/comment/${id}`, { comment: newComment }, authConfig);
      setNewComment("");
      fetchAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (reviewId) => {
    await axios.delete(`${API}/review/${reviewId}`, authConfig);
    fetchAllData();
  };

  const deleteComment = async (commentId) => {
    await axios.delete(`${API}/comment/${commentId}`, authConfig);
    fetchAllData();
  };

  const handleUpdateReview = async (id) => {
    await axios.patch(`${API}/review/${id}`, { review: editReviewText }, authConfig);
    setEditingReviewId(null);
    fetchAllData();
  };

  const handleUpdateComment = async (id) => {
    await axios.patch(`${API}/comment/${id}`, { comment: editCommentText }, authConfig);
    setEditingCommentId(null);
    fetchAllData();
  };

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <CenterLoader label="Loading blog" variant="waves" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/user-dash')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </button>

        {/* Blog Content */}
        <div className="card">
          <div className="card-body">
            {/* Blog Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {blog.category}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Blog Image */}
            {blog.image && (
              <div className="mb-8">
                <img 
                  src={`${API}/uploads/${blog.image}`} 
                  alt={blog.title} 
                  className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg" 
                />
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{blog.description}</p>
            </div>

            {/* Like Button */}
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={() => toggleLike(blog.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  likedBlogs.includes(blog.id) 
                    ? "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100" 
                    : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <Heart className={`w-5 h-5 ${likedBlogs.includes(blog.id) ? "fill-current" : ""}`} />
                {likesCount[blog.id] || 0} {likesCount[blog.id] === 1 ? 'Like' : 'Likes'}
              </button>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="card mb-8">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            <div className="space-y-2 mb-4">
              {reviews.map((r) => (
                <div key={r.id} className="border p-3 rounded-xl bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{r.user.username || r.user.name}</span>
                    <span>⭐ {r.rating}</span>
                  </div>

                  {editingReviewId === r.id ? (
                    <>
                      <textarea
                        value={editReviewText}
                        onChange={(e) => setEditReviewText(e.target.value)}
                        className="w-full border p-2 rounded-lg mb-2"
                      />
                      <button
                        onClick={() => handleUpdateReview(r.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingReviewId(null)}
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <p>{r.review}</p>
                  )}
                  
                  {/* Only show if current user wrote this */}
                  {userReview.some(ur => ur.id === r.id) && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingReviewId(r.id);
                          setEditReviewText(r.review);
                        }}
                        className="text-blue-600 font-semibold"
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-500 font-semibold" 
                        onClick={() => deleteReview(r.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Review */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`cursor-pointer text-2xl ${star <= newRating ? "text-yellow-400" : "text-gray-300"}`}
                    onClick={() => setNewRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Write your review..."
                className="w-full border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                onClick={submitReview}
                className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl font-semibold"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
            <div className="space-y-2 mb-4">
              {comments.map((c) => (
                <div key={c.id} className="border p-3 rounded-xl bg-gray-50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">{c.user.username || c.user.name}</span>
                    <span className="text-gray-400 text-sm">{new Date(c.commented_at).toLocaleString()}</span>
                  </div>
                  
                  {editingCommentId === c.id ? (
                    <>
                      <input
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="w-full border p-2 rounded-lg mb-2"
                      />
                      <button
                        onClick={() => handleUpdateComment(c.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <p>{c.comment}</p>
                  )}

                  {/* Show Edit/Delete for all comments by logged-in user */}
                  {userComments.some(uc => uc.id === c.id) && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(c.id);
                          setEditCommentText(c.comment);
                        }}
                        className="text-blue-600 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 font-semibold px-2 py-1 rounded hover:bg-red-50"
                        onClick={() => deleteComment(c.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Comment Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                onClick={submitComment}
                className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-xl font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;