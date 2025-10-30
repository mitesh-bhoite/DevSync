import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Developers.css";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Developers = () => {
  const { user } = useContext(AuthContext);
  const [developers, setDevelopers] = useState([]);
  const [filteredDevelopers, setFilteredDevelopers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDevelopers();
  }, []);

  useEffect(() => {
    // Filter developers based on search term
    if (searchTerm.trim() === "") {
      setFilteredDevelopers(developers);
    } else {
      const filtered = developers.filter(
        (dev) =>
          dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dev.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (dev.skills &&
            dev.skills.some((skill) =>
              skill.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
      setFilteredDevelopers(filtered);
    }
  }, [searchTerm, developers]);

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      setDevelopers(res.data);
      setFilteredDevelopers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching developers:", error);
      setLoading(false);
    }
  };

  const handleConnect = async (developerId) => {
    try {
      await axios.put(`${API_URL}/api/users/connect/${developerId}`);
      setMessage("Connected successfully!");
      fetchDevelopers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Error connecting");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDisconnect = async (developerId) => {
    try {
      await axios.put(`${API_URL}/api/users/disconnect/${developerId}`);
      setMessage("Disconnected successfully!");
      fetchDevelopers();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error disconnecting");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const isConnected = (developerId) => {
    return user?.connections?.some(
      (conn) => conn._id === developerId || conn === developerId
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="developers-container">
      <div className="developers-header">
        <h1>Connect with Developers</h1>
        <p>Find and connect with talented developers from around the world</p>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by name, email, or skills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="clear-search-btn"
          >
            Clear
          </button>
        )}
      </div>

      {message && (
        <div
          className={`alert ${
            message.includes("success") ? "alert-success" : "alert-error"
          }`}
        >
          {message}
        </div>
      )}

      {filteredDevelopers.length === 0 ? (
        <div className="card text-center">
          <h3>No developers found</h3>
          <p>
            {searchTerm
              ? "Try a different search term"
              : "Be the first to invite others!"}
          </p>
        </div>
      ) : (
        <>
          <p className="results-count">
            Showing {filteredDevelopers.length} developer
            {filteredDevelopers.length !== 1 ? "s" : ""}
          </p>
          <div className="developers-grid">
            {filteredDevelopers.map((developer) => (
              <div key={developer._id} className="developer-card">
                <img
                  src={
                    developer.profilePhoto || "https://via.placeholder.com/150"
                  }
                  alt={developer.name}
                  className="developer-image"
                />
                <div className="developer-info">
                  <h3>{developer.name}</h3>
                  <p className="developer-email">{developer.email}</p>

                  {developer.bio && (
                    <p className="developer-bio">{developer.bio}</p>
                  )}

                  {developer.skills && developer.skills.length > 0 && (
                    <div className="developer-skills">
                      {developer.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                      {developer.skills.length > 3 && (
                        <span className="skill-badge">
                          +{developer.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="developer-links">
                    {developer.github && (
                      <a
                        href={developer.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                      >
                        GitHub
                      </a>
                    )}
                    {developer.linkedin && (
                      <a
                        href={developer.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon"
                      >
                        LinkedIn
                      </a>
                    )}
                  </div>

                  <div className="developer-actions">
                    {isConnected(developer._id) ? (
                      <button
                        onClick={() => handleDisconnect(developer._id)}
                        className="btn btn-secondary btn-block"
                      >
                        Connected
                      </button>
                    ) : (
                      <button
                        onClick={() => handleConnect(developer._id)}
                        className="btn btn-primary btn-block"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Developers;
