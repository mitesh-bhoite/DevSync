import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faComments,
  faRocket,
  faHandshake,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">DevSync</span>
          </h1>
          <p className="hero-subtitle">
            Connect, Collaborate, and Grow with Developers Worldwide
          </p>
          <p className="hero-description">
            Join our community of passionate developers. Share your projects,
            build your network, and collaborate on amazing ideas.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Login
            </Link>
          </div>
        </div>

        <div className="features-section">
          <h2>Why Choose DevSync?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3>Connect</h3>
              <p>Network with developers from around the world</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faComments} />
              </div>
              <h3>Share</h3>
              <p>Post updates, projects, and ideas with the community</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faRocket} />
              </div>
              <h3>Grow</h3>
              <p>Build your developer profile and showcase your skills</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3>Collaborate</h3>
              <p>Find teammates and work on exciting projects together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
