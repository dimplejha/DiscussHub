const Comment = require('../models/Comment');
const Discussion = require('../models/Discussion');

exports.createComment = async (req, res) => {
  const { text, discussionId } = req.body;
  try {
    const comment = new Comment({
      text,
      user: req.user.id,
      discussion: discussionId,
    });
    await comment.save();
    const discussion = await Discussion.findById(discussionId);
    discussion.comments.push(comment._id);
    await discussion.save();
    res.status(201).json(comment);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    return res.status(500).send({ status: false, message: error.message })

  }
};

exports.likeComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.likes.includes(req.user.id)) {
      return res.status(400).json({ error: 'Already liked this comment' });
    }
    comment.likes.push(req.user.id);
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.replyComment = async (req, res) => {
  const { text, parentId } = req.body;
  try {
    const parentComment = await Comment.findById(parentId);
    if (!parentComment) {
      return res.status(404).json({ error: 'Parent comment not found' });
    }
    const reply = new Comment({
      text,
      user: req.user.id,
      discussion: parentComment.discussion,
    });
    await reply.save();
    res.status(201).json(reply);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(id, { text }, { new: true });
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json(comment);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message })
  }
};

