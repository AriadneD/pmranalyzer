import React from "react";
import { Link } from "react-router-dom";
import '../home.css';
import VideoPlayer from '../components/VideoPlayer';

const Home = () => {
  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Navigation Bar */}
      <nav style={{position: "fixed", zIndex: "999", width: "100%"}} className="bg-carbon text-white p-4 flex justify-between items-center">
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "10px"}}>
        <img src="https://i.ibb.co/XznxwNq/imageedit-8-7541710378.png" class="logo"/>
        <h2 className="text-2xl font-bold">PMR Analyzer</h2>
        </div>
        
        <div className="flex space-x-6">
          <Link to="/" className="mt-2 hover:text-watermelon">Home</Link>
          <Link to="/login" className="mt-2 hover:text-watermelon">Login</Link>
          <Link to="/register" className="inline-block px-6 py-2 bg-white text-watermelon font-bold rounded hover:bg-sky hover:text-white transition">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}

      <div class="gradient-bg" style={{}}>
      <div className="text-white py-20 half">
        <h1 className="text-5xl font-bold">Analyze Your Customer Interviews with Ease</h1>
        <p className="mt-4 text-lg">
          Turn uploaded interview transcripts and notes into organized, searchable summaries.
          Learn from your users in minutes with AI; Generate personas, competitive landscape, product roadmaps, market trend reports and more.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block px-6 py-3 bg-watermelon text-white font-bold rounded hover:bg-white hover:text-watermelon transition"
        >
          Analyze yours (It's free)
        </Link>
      </div>
        
        <VideoPlayer />
      </div>
      
      {/* Feature Section */}
      <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-carbon mb-6">Your PMR, Zero Hassle</h2>
        <p className="text-lg text-gray-700 mb-10">
          PMR analyzer lets you summarize messy transcripts and notes into actionable insights & graphs in just a few clicks — no coding, hosting, or complex setup needed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-upload text-sky text-3xl mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Mass Upload PMR Docs</h3>
            <p className="text-gray-600">
              Upload as many as you want: interview transcripts, notes, emails, etc.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-database text-sky text-3xl mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Searchable Database</h3>
            <p className="text-gray-600">
              Search through, edit, and save PMR docs with ease.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-users text-sky text-3xl mb-4"></i>
            <h3 className="text-xl font-bold mb-2">User Archetypes</h3>
            <p className="text-gray-600">
              Clusters users you've interviewed into groups so you can build personas.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-lightbulb text-sky text-3xl mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Actionable Insights</h3>
            <p className="text-gray-600">
              Product suggestions that address user pain points, with detailed strategy and competitive analysis documentation.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-upload text-sky text-3xl mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Customer Research</h3>
            <p className="text-gray-600">
              Customer follow-up surveys to obtain deeper insights.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <i className="fas fa-database text-sky text-3xl mb-4"></i>
            <h3 className="text-xl font-bold mb-2">Market Research Reports</h3>
            <p className="text-gray-600">
              Web search and data-driven market trends, opportunities, and risks you can learn and share with the team.
            </p>
          </div>
          
        </div>
      </section>

      {/* Who is PMR Analyzer For Section */}
      <section className="bg-sky py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Who is PMR Analyzer For?</h2>
            <p className="text-lg text-white leading-relaxed">
              PMR Analyzer is designed for founders, product managers, and entrepreneurs who need
              actionable insights from customer interviews, feedback, and market data—without the hassle.
            </p>
          </div>
          {/* Right Image */}
          <div className="lg:w-1/2 flex justify-center">
            <img
              src="https://i.ibb.co/tqfxZ0f/imageedit-2-6424558147.png"
              alt="PMR Analyzer Illustration"
              class="hero-img"
            />
          </div>
        </div>
      </section>


      {/* Sign Up Section */}
      <section className="bg-watermelon text-white py-12 text-center">
        <h2 className="text-3xl font-bold">Ready to Supercharge Your Customer Research?</h2>
        <p className="text-lg mt-4">
          Sign up now and start generating actionable insights in minutes.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-block px-6 py-3 bg-white text-watermelon font-bold rounded hover:bg-sky hover:text-white transition"
        >
          Sign Up for Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-carbon text-white py-6 text-center">
        <p>© {new Date().getFullYear()} PMR Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
