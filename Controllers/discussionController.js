const Discussion = require('../models/Discussion');
const Comment = require('../models/comment');

exports.createDiscussion = async (req, res) => {
  const { text, image, hashtags } = req.body;
  try {
    const discussion = new Discussion({
      text,
      image,
      hashtags,
      user: req.user.id,
    });
    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDiscussion = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const discussion = await Discussion.findByIdAndUpdate(id, updates, { new: true });
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    res.status(200).json(discussion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteDiscussion = async (req, res) => {
  const { id } = req.params;
  try {
    const discussion = await Discussion.findByIdAndDelete(id);
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    res.status(200).json({ message: 'Discussion deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDiscussionsByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const discussions = await Discussion.find({ hashtags: tag }).populate('user', '-password');
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDiscussionsByText = async (req, res) => {
  const { text } = req.params;
  try {
    const discussions = await Discussion.find({ text: { $regex: text, $options: 'i' } }).populate('user', '-password');
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().populate('user', '-password');
    res.status(200).json(discussions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

