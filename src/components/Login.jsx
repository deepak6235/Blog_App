import React, { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const validateForm = () => {
    const newErrors = { username: "", password: "" };
    let isValid = true;
  
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
  
    if (!trimmedUsername) {
      newErrors.username = "Username or email is required";
      isValid = false;
    } else if (
      trimmedUsername.includes("@") &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedUsername)
    ) {
      newErrors.username = "Please enter a valid email address";
      isValid = false;
    }
  
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/;
    if (!trimmedPassword) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(trimmedPassword)) {
      newErrors.password =
        "Password must be at least 6 characters and include at least 1 uppercase and 1 lowercase letter";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const API = import.meta.env.VITE_API;

  console.log(API)
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API}/auth/login`, {
        username: username.trim(),
        password: password.trim(),
      }, { __skipGlobalLoading: true });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("id", res.data.id);

        alert("Login successful!");

        if (res.data.role === "admin") navigate("/admin-dash");
        else navigate("/user-dash");
      }
    } catch (err) {
      console.error(err);
      setServerError(
        err.response?.data?.message || "Invalid username or password"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card">
          <div className="card-body">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username or Email
                </label>
                <input
                  type="text"
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  className={`input ${
                    errors.username ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className={`input pr-12 ${
                      errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {serverError}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary w-full ${isSubmitting ? "opacity-80" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="inline-block animate-spin"
                      style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.5)", borderTopColor: "white", borderRadius: "50%" }}
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 space-y-3">
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Create one here
                  </a>
                </p>
              </div>
              <div className="text-center">
                <a
                  href="/forget-password"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
