import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; 
import CenterLoader from "../CenterLoader";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    stage: "draft",
    scheduled_at: "",
  });

  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert('please login')
      navigate("/", { replace: true });
    }


    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API}/homeData/viewupdate/${id}`);
        const blog = res.data;
        setFormData({
          title: blog.title,
          description: blog.description,
          category: blog.category,
          image: null,
          stage: blog.stage,
          scheduled_at: blog.scheduled_at
            ? new Date(
                new Date(blog.scheduled_at).getTime() -
                  new Date().getTimezoneOffset() * 60000
              )
                .toISOString()
                .slice(0, 16)
            : "",

          created_at: blog.created_at
              ? new Date(
                  new Date(blog.created_at).getTime() -
                    new Date().getTimezoneOffset() * 60000
                )
                  .toISOString()
                  .slice(0, 16)
              : "",


        });
        
        setCurrentImage(blog.image);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("category", formData.category);
        if (formData.image) data.append("image", formData.image);
        data.append("stage", formData.stage);
        if (formData.created_at) data.append("created_at", formData.created_at);
        if (formData.scheduled_at) data.append("scheduled_at", formData.scheduled_at);
    
  
        console.log("Updating blog with ID:", id);
        for (let [key, value] of data.entries()) {
          console.log(key, value);
        }
        
    

        const res = await axios.patch(`${API}/homeData/update/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
    

        if (res.status === 200 && res.data) {
          console.log(res.status)
          alert("Blog updated successfully!");
          navigate("/admin-view-blog");
        } else {
          alert("Update failed! Please try again.");
        }
      } catch (err) {
        console.error("Error updating blog:", err);
        alert("Something went wrong while updating.");
      }
    };
  

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <CenterLoader label="Loading post" variant="waves" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Update Blog Post
          </h1>
          <p className="text-gray-600">
            Modify your blog post content and settings
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="Enter an engaging title for your post"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="input resize-none"
                  placeholder="Write a compelling description for your blog post..."
                />
              </div>

              {/* Category and Stage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="technology">Technology</option>
                    <option value="business">Business</option>
                    <option value="health">Health</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Publication Status *
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="deleted">Deleted</option>
                  </select>
                </div>
              </div>

              {/* Current Image */}
              {currentImage && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Image
                  </label>
                  <div className="border-2 border-gray-200 rounded-lg p-4">
                    <img
                      src={`${API}/uploads/${currentImage}`}
                      alt="Current blog image"
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentImage ? "Replace Image" : "Featured Image"}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload a file</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {formData.image && (
                  <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {formData.image.name}
                  </div>
                )}
              </div>

              {/* Scheduled Date */}
              {formData.stage === "scheduled" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule Publication
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_at"
                    value={formData.scheduled_at}
                    onChange={handleChange}
                    className="input"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Select when you want this post to be published
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin-view-blog')}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Post
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;
