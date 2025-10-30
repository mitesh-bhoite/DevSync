import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    connections: 0,
    posts: 0,
  });

  useEffect(() => {
    if (user) {
      setStats({
        connections: user.connections ? user.connections.length : 0,
        posts: 0,
      });
      fetchUserPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      const userPosts = res.data.filter((post) => post.user._id === user.id);
      setPosts(userPosts);
      setStats((prev) => ({ ...prev, posts: userPosts.length }));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}!!!</h1>
        <p>Here's what's happening with your account</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.connections}</h3>
            <p>Connections</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.posts}</h3>
            <p>Posts</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>{user?.skills?.length || 0}</h3>
            <p>Skills</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="card">
            <h2>Your Profile</h2>
            <div className="profile-preview">
              <img
                src={user?.profilePhoto || "https://via.placeholder.com/100"}
                alt={user?.name}
                className="profile-image-small"
              />
              <div className="profile-info">
                <h3>{user?.name}</h3>
                <p>{user?.email}</p>
                <p className="bio">{user?.bio || "No bio added yet"}</p>
              </div>
            </div>
            <Link to="/profile" className="btn btn-primary">
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="card">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/posts" className="action-btn">
                <span className="action-icon">📝</span>
                <div>
                  <h4>Create Post</h4>
                  <p>Share your thoughts</p>
                </div>
              </Link>
              <Link to="/developers" className="action-btn">
                <span className="action-icon">🔍</span>
                <div>
                  <h4>Find Developers</h4>
                  <p>Connect with others</p>
                </div>
              </Link>
              <Link to="/profile" className="action-btn">
                <span className="action-icon">⚙️</span>
                <div>
                  <h4>Settings</h4>
                  <p>Update your profile</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {posts.length > 0 && (
        <div className="card">
          <h2>Your Recent Posts</h2>
          <div className="recent-posts">
            {posts.slice(0, 3).map((post) => (
              <div key={post._id} className="post-preview">
                <p>{post.content.substring(0, 100)}...</p>
                <small>{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
