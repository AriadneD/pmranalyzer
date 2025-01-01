import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from 'react-router-dom';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";

function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login"); // Redirect to login if user is not authenticated
      } else {
        setName(user.displayName || "");
        setEmail(user.email || "");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Update the display name if it has changed
      if (name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // Update the email if it has changed
      if (email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }

      // Update the password if provided
      if (password) {
        await updatePassword(auth.currentUser, password);
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    setError("");
    setSuccess("");

    try {
      await deleteUser(auth.currentUser);
      navigate("/register"); // Redirect to registration or login page after account deletion
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded-lg">

        
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>

      <h1 className="text-2xl font-bold">Edit Profile</h1>
        <button>
        <Link to="/dashboard" className="bg-watermelon px-4 py-2 rounded text-white font-semibold hover:bg-white hover:text-watermelon transition">
          Back to Dashboard
        </Link>
        </button>

       
        </div>
        
      <br/>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">New Password:</label>
          <input
            type="password"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-sky text-white rounded hover:bg-sky-600"
        >
          Update Profile
        </button>
      </form>
      <button
        onClick={handleDeleteAccount}
        className="w-full mt-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Account
      </button>
    </div>
  );
}

export default EditProfile;
