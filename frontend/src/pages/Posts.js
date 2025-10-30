import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import "./Posts.css";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Posts = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ content: "", image: "" });
  const [commentText, setCommentText] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/posts`);
      setPosts(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) {
      setMessage("Please enter some content");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/posts`, newPost);
      setNewPost({ content: "", image: "" });
      setMessage("Post created successfully!");
      fetchPosts();
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error creating post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find((p) => p._id === postId);
      if (post.likes.includes(user.id)) {
        await axios.put(`${API_URL}/api/posts/unlike/${postId}`);
      } else {
        await axios.put(`${API_URL}/api/posts/like/${postId}`);
      }
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;

    try {
      await axios.post(`${API_URL}/api/posts/comment/${postId}`, {
        text: commentText[postId],
      });
      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error commenting:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${API_URL}/api/posts/${postId}`);
        setMessage("Post deleted successfully!");
        fetchPosts();
        setTimeout(() => setMessage(""), 3000);
      } catch (error) {
        setMessage("Error deleting post");
      }
    }
  };

  const isLiked = (post) => {
    return post.likes.includes(user?.id);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="posts-container">
      <div className="posts-header">
        <h1>Community Posts 📝</h1>
        <p>Share your thoughts, projects, and updates</p>
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

      {/* Create Post Section */}
      <div className="card create-post-card">
        <h2>Create a Post</h2>
        <form onSubmit={handleCreatePost}>
          <div className="form-group">
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              rows="4"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={newPost.image}
              onChange={(e) =>
                setNewPost({ ...newPost, image: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Share Post
          </button>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="card text-center">
            <h3>No posts yet</h3>
            <p>Be the first to share something!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <div className="post-author">
                  <img
                    src={
                      post.user.profilePhoto || "https://via.placeholder.com/50"
                    }
                    alt={post.user.name}
                    className="post-author-image"
                  />
                  <div>
                    <h4>{post.user.name}</h4>
                    <p className="post-date">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {post.user._id === user?.id && (
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="delete-btn"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <div className="post-content">
                <p>{post.content}</p>
                {post.image && (
                  <img src={post.image} alt="Post" className="post-image" />
                )}
              </div>

              <div className="post-actions">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`action-btn ${isLiked(post) ? "liked" : ""}`}
                >
                  {isLiked(post) ? "❤️" : "🤍"} {post.likes.length}
                </button>
                <span className="action-btn">💬 {post.comments.length}</span>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                {post.comments.length > 0 && (
                  <div className="comments-list">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="comment">
                        <img
                          src={
                            comment.user.profilePhoto ||
                            "https://via.placeholder.com/40"
                          }
                          alt={comment.user.name}
                          className="comment-author-image"
                        />
                        <div className="comment-content">
                          <strong>{comment.user.name}</strong>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [post._id]: e.target.value,
                      })
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleComment(post._id)
                    }
                  />
                  <button
                    onClick={() => handleComment(post._id)}
                    className="btn btn-primary btn-small"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Posts;
