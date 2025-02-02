import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { User, Plus, Briefcase, Home, Info, Phone, LogOut } from "lucide-react";

function Profile() {
  const [user, setUser] = useState<{ name: string; avatar?: string } | null>(null);
  // const [username, setUsername] = useState<string | null>(null);

  const [projects, setProjects] = useState<{ _id: string; name: string; description?: string }[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users/user`, {
          withCredentials: true,
        });
        // setUsername(response.data.username);
        console.log("User:", response.data);
        setUser({ name: response.data.username, avatar: "" });

        const projectResponse = await axios.get(`${BACKEND_URL}/project/get-all-projects/${response.data.userId}`, {
          withCredentials: true,
        });

        setProjects(projectResponse.data);
      } catch (err) {
        console.error("Error fetching user/projects:", err);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = () => {
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-900"
      style={{ backgroundImage: "url('./images/bg7.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Header with Navigation */}
      <header className="bg-slate-800 shadow-lg border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-blue-400 animate-pulse" />
              <h1 className="ml-2 text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="/Landing" className="flex items-center text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105">
                <Home className="w-4 h-4 mr-2" /> Home
              </a>
              <a href="/Landing" className="flex items-center text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105">
                <Info className="w-4 h-4 mr-2" /> About
              </a>
              <a href="/Landing" className="flex items-center text-slate-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out hover:scale-105">
                <Phone className="w-4 h-4 mr-2" /> Contact Us
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4 relative">
            <span className="text-slate-300">{user?.name || "Guest"}</span>
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="focus:outline-none hover:scale-105 transition-transform duration-300">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full border-2 border-blue-400 cursor-pointer hover:border-blue-300 transition-colors duration-300" />
                ) : (
                  <User className="h-10 w-10 p-2 rounded-full bg-slate-700 text-blue-400 cursor-pointer hover:bg-slate-600 transition-colors duration-300" />
                )}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-xl py-1 z-10 border border-slate-700 animate-fadeIn">
                  <button onClick={handleSignOut} className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors duration-300">
                    <LogOut className="h-4 w-4 mr-2" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Projects</h2>
          <button onClick={() => navigate("/create-project")} className="inline-flex items-center px-4 py-2 border border-blue-400 rounded-md shadow-lg text-sm font-medium text-white bg-blue-400 hover:bg-blue-400 hover:text-white focus:outline-none transform hover:-translate-y-1 transition-all duration-300">
            <Plus className="h-5 w-5 mr-2" /> Create New Project
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 p-6 border border-slate-700 hover:border-blue-400 transform hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                <p className="text-slate-300">{project.description || "No description available."}</p>
                <div className="mt-4 flex justify-end">
                  <button onClick={() => navigate(`/projects/${project._id}`)} className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-300 group flex items-center">
                    View Details <span className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-300 text-lg mt-10">No projects found yet. Click on "Create New Project" and start building your own website in seconds!</p>
        )}
      </main>
    </div>
  );
}

export default Profile;
