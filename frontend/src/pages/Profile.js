import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Profile.css";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Profile = () => {
  const { user, loadUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
    profilePhoto: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        skills: user.skills ? user.skills.join(", ") : "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        profilePhoto: user.profilePhoto || "",
      });
    }
  }, [user]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill);

      await axios.put(`${API_URL}/api/users/profile`, {
        ...formData,
        skills: skillsArray,
      });

      setMessage("Profile updated successfully!");
      setIsEditing(false);
      loadUser();
      setLoading(false);
    } catch (error) {
      setMessage("Error updating profile");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your developer profile information</p>
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

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-image-section">
            <img
              src={formData.profilePhoto || "https://via.placeholder.com/150"}
              alt={user.name}
              className="profile-image"
            />
            <h2>{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {!isEditing ? (
            <div className="profile-details">
              <div className="detail-section">
                <h3>📝 Bio</h3>
                <p>{user.bio || "No bio added yet"}</p>
              </div>

              <div className="detail-section">
                <h3>⚡ Skills</h3>
                <div className="skills-list">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p>No skills added yet</p>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>🔗 Links</h3>
                {user.github && (
                  <a
                    href={user.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    GitHub: {user.github}
                  </a>
                )}
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    LinkedIn: {user.linkedin}
                  </a>
                )}
                {!user.github && !user.linkedin && <p>No links added yet</p>}
              </div>

              <div className="detail-section">
                <h3>👥 Connections</h3>
                <p>
                  {user.connections ? user.connections.length : 0} connections
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="profile-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={onChange}
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Profile Photo URL</label>
                <input
                  type="text"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={onChange}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={onChange}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={onChange}
                  placeholder="JavaScript, React, Node.js"
                />
              </div>

              <div className="form-group">
                <label>GitHub URL</label>
                <input
                  type="text"
                  name="github"
                  value={formData.github}
                  onChange={onChange}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="form-group">
                <label>LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={onChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
