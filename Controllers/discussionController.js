const multer = require('multer');
const path = require('path');
const Discussion = require('../models/Discussion');
const Comment = require('../models/Comment');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.upload = upload.single('image');

exports.createDiscussion = async (req, res) => {
  console.log('Request body:', req.body); // Log request body
  const { text, hashtags } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const discussion = new Discussion({
      text,
      image,
      hashtags: hashtags ? hashtags.split(',') : [], // Handle undefined hashtags
      user: req.user.id,
    });
    await discussion.save();
    res.status(201).json(discussion);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
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
    return res.status(500).send({ status: false, message: error.message })
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
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.getDiscussionsByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const discussions = await Discussion.find({ hashtags: tag }).populate('user', '-password');
    res.status(200).json(discussions);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.getDiscussionsByText = async (req, res) => {
  const { text } = req.params;
  try {
    const discussions = await Discussion.find({ text: { $regex: text, $options: 'i' } }).populate('user', '-password');
    res.status(200).json(discussions);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().populate('user', '-password');
    res.status(200).json(discussions);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.getDiscussion = async (req, res) => {
  const { id } = req.params;
  try {
    const discussion = await Discussion.findById(id).populate('user', '-password').populate('comments');
    if (!discussion) {
      return res.status(404).json({ error: 'Discussion not found' });
    }
    discussion.viewCount += 1;
    await discussion.save();
    res.status(200).json(discussion);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};


