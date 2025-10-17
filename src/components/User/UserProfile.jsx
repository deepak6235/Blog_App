import React, { useState, useEffect } from "react";
import axios from "axios";
import CenterLoader from "../CenterLoader";

const countryCodes = [
  { code: "+91", name: "India" },
  { code: "+1", name: "USA" },
  { code: "+44", name: "UK" },
];

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    username: "",
    age: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tempProfile, setTempProfile] = useState({});
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const user = localStorage.getItem("username");

    const API = import.meta.env.VITE_API;

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    fetchProfile();
    console.log(user)
    
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/user/profile`, getAuthConfig());
      const fullPhone = res.data.phone || "";
      let countryCode = "+91";
      let phone = fullPhone;
      const matchedCode = countryCodes.find((c) => fullPhone.startsWith(c.code));
      if (matchedCode) {
        countryCode = matchedCode.code;
        phone = fullPhone.slice(countryCode.length);
      }
      setProfile({ ...res.data, phone, countryCode });
      setTempProfile({ ...res.data, phone, countryCode });
    } catch (err) {
      console.error("Error fetching profile:", err);
      alert("Failed to fetch profile. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({ ...tempProfile, [name]: value });
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!tempProfile.name.trim()) newErrors.name = "Name is required";
    if (!tempProfile.email.trim()) newErrors.email = "Email is required";
    else if (!tempProfile.email.endsWith("@gmail.com"))
      newErrors.email = "Email must be a valid @gmail.com address";

    if (!tempProfile.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{6,15}$/.test(tempProfile.phone))
      newErrors.phone = "Phone number must be 6-15 digits";

    if (!tempProfile.username.trim()) newErrors.username = "Username is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    try {
      const res = await axios.patch(
        `${API}/user/update/profile`,
        { ...tempProfile, phone: tempProfile.countryCode + tempProfile.phone },
        getAuthConfig()
      );
      if (res.status === 200) {
        setProfile(tempProfile);
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
    setErrors({});
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      alert(
        "Password must be at least 6 characters and include 1 uppercase and 1 lowercase letter"
      );
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return false;
    }
    return true;
  };

  const handleSavePassword = async () => {
    if (!validatePassword()) return;

    try {
      const res = await axios.patch(
        `${API}/user/change-password`,
        passwordData,
        getAuthConfig()
      );
      if (res.status === 200) {
        alert("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordChange(false);
      }
    } catch (err) {
      console.error("Error changing password:", err);
      alert("Failed to change password. Make sure your current password is correct.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <CenterLoader label="Loading profile" variant="waves" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and settings</p>
        </div>

        {/* Profile Card */}
        <div className="card">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

        {/* Profile Fields */}
        <div className="space-y-4">
          {/* Name & Email */}
          {["name", "email", "username"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 font-semibold mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                name={field}
                value={tempProfile[field]}
                onChange={handleChange}
                className={`input ${
                  isEditing
                    ? ""
                    : "bg-gray-50 cursor-not-allowed"
                }`}
                readOnly={!isEditing}
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          {/* Phone with country code */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Phone</label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={tempProfile.countryCode}
                onChange={handleChange}
                className="px-3 py-2 border rounded-xl"
                disabled={!isEditing}
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phone"
                value={tempProfile.phone}
                onChange={handleChange}
                className={`input flex-1 ${
                  isEditing ? "" : "bg-gray-50 cursor-not-allowed"
                }`}
                readOnly={!isEditing}
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          {/* Age */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Age</label>
            <input
              type="text"
              value={profile.age}
              readOnly
              className="input bg-gray-50 cursor-not-allowed"
            />
          </div>
        </div>

            {/* Profile Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    className="btn btn-success"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="card mt-8">
          <div className="card-body">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
            {!showPasswordChange ? (
              <button
                onClick={() => setShowPasswordChange(true)}
                className="btn btn-secondary w-full"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Change Password
              </button>
            ) : (
              <div className="space-y-4">
                {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field === "currentPassword"
                        ? "Current Password"
                        : field === "newPassword"
                        ? "New Password"
                        : "Confirm Password"}
                    </label>
                    <input
                      type="password"
                      name={field}
                      value={passwordData[field]}
                      onChange={handlePasswordChange}
                      className="input"
                    />
                  </div>
                ))}
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handleSavePassword}
                    className="btn btn-success"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Password
                  </button>
                  <button
                    onClick={() => setShowPasswordChange(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
