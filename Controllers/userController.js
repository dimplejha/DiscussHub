const User = require('../models/User');

// exports.createUser = async (req, res) => {
//   const { name, mobile, email, password } = req.body;
//   try {
//     const user = new User({ name, mobile, email, password });
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


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
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.followUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const followUser = await User.findById(req.params.id);

    if (!followUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.following.includes(req.params.id)) {
      return res.status(400).json({ error: 'Already following this user' });
    }

    user.following.push(req.params.id);
    followUser.followers.push(req.user.id);

    await user.save();
    await followUser.save();

    res.status(200).json({ message: 'User followed' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const unfollowUser = await User.findById(req.params.id);

    if (!unfollowUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.following.includes(req.params.id)) {
      return res.status(400).json({ error: 'Not following this user' });
    }

    user.following = user.following.filter(followingId => followingId.toString() !== req.params.id);
    unfollowUser.followers = unfollowUser.followers.filter(followerId => followerId.toString() !== req.user.id);

    await user.save();
    await unfollowUser.save();

    res.status(200).json({ message: 'User unfollowed' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};