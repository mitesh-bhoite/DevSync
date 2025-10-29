const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("connections", "name email profilePhoto");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/users
// @desc    Get all users
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } }).select(
      "-password"
    );
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  const { name, bio, skills, github, linkedin, profilePhoto } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (github) user.github = github;
    if (linkedin) user.linkedin = linkedin;
    if (profilePhoto) user.profilePhoto = profilePhoto;

    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("connections", "name email profilePhoto");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/users/connect/:id
// @desc    Connect with another user
// @access  Private
router.put("/connect/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const connectUser = await User.findById(req.params.id);

    if (!connectUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if already connected
    if (user.connections.includes(req.params.id)) {
      return res.status(400).json({ msg: "Already connected with this user" });
    }

    // Add connection both ways
    user.connections.push(req.params.id);
    connectUser.connections.push(req.user.id);

    await user.save();
    await connectUser.save();

    res.json({ msg: "Connected successfully", connections: user.connections });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/users/disconnect/:id
// @desc    Disconnect from a user
// @access  Private
router.put("/disconnect/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const disconnectUser = await User.findById(req.params.id);

    if (!disconnectUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Remove connection both ways
    user.connections = user.connections.filter(
      (conn) => conn.toString() !== req.params.id
    );
    disconnectUser.connections = disconnectUser.connections.filter(
      (conn) => conn.toString() !== req.user.id
    );

    await user.save();
    await disconnectUser.save();

    res.json({
      msg: "Disconnected successfully",
      connections: user.connections,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
