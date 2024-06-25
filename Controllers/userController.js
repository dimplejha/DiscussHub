const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, mobile, email, password } = req.body;
  try {
    const updates = { name, mobile, email };

    // If password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, { is_active: false }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User marked as inactive', user });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


exports.followUser = async (req, res) => {
  try {
    // Find the currently logged-in user and the user to be followed
    const user = await User.findById(req.user.id);
    const followUser = await User.findById(req.params.id);

    // Check if the user to be followed exists
    if (!followUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent a user from following themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }

    // Check if the user is already following the target user
    if (user.following.includes(req.params.id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    // Add the target user to the following list of the current user
    user.following.push(req.params.id);
    // Add the current user to the followers list of the target user
    followUser.followers.push(req.user.id);

    // Save the updated user documents
    await user.save();
    await followUser.save();

    res.status(200).json({ message: 'User followed', user,followUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


exports.unfollowUser = async (req, res) => {
  try {
    // Find the currently logged-in user and the user to be unfollowed
    const user = await User.findById(req.user.id);
    const unfollowUser = await User.findById(req.params.id);

    // Check if the user to be unfollowed exists
    if (!unfollowUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is actually following the target user
    if (!user.following.includes(req.params.id)) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    // Remove the target user from the following list of the current user
    user.following = user.following.filter(followingId => followingId.toString() !== req.params.id);
    // Remove the current user from the followers list of the target user
    unfollowUser.followers = unfollowUser.followers.filter(followerId => followerId.toString() !== req.user.id);

    // Save the updated user documents
    await user.save();
    await unfollowUser.save();

    res.status(200).json({ message: 'User unfollowed',user, unfollowUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
