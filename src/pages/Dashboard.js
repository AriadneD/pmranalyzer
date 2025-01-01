// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import PMRDashboard from '../components/PMRDashboard';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navigation */}
      <header className="bg-sky text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">PMR Analyzer Dashboard</h1>
        <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
        <button>
        <Link to="/edit-profile" className="bg-watermelon px-4 py-2 rounded text-white font-semibold hover:bg-white hover:text-watermelon transition">
          Edit Profile
        </Link>
        </button>

        <button
          onClick={() => auth.signOut().then(() => navigate('/Logout'))}
          className="bg-watermelon px-4 py-2 rounded text-white font-semibold hover:bg-white hover:text-watermelon transition"
        >
          Logout
        </button>
        </div>
        
      </header>

      

      {/* Main Content */}
      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-700">
          Welcome, {user.displayName}
        </h1>
        <PMRDashboard user={user} />
      </main>
    </div>
  );
}

export default Dashboard;
