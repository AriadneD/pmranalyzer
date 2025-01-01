import React, { useState } from 'react';

import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth, provider } from '../firebase'; // Import the Google Auth provider


function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
      try {
        await signInWithPopup(auth, provider); // Sign in with Google
        navigate('/dashboard');
      } catch (error) {
        setError(error.message);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">

      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: "10px"}}>

<h1 className="text-2xl font-bold">Register</h1>
  <button>
  <Link to="/" className="bg-watermelon px-4 py-2 rounded text-white font-semibold hover:bg-white hover:text-watermelon transition">
    Back Home
  </Link>
  </button>

</div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky"
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky"
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky text-white py-2 rounded hover:bg-sky-600"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4 text-gray-700">
          Already have an account?{' '}
          <a href="/login" className="text-sky hover:underline">
            Login here
          </a>
        </p>
        <div className="mt-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            <i className="fab fa-google"></i> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
