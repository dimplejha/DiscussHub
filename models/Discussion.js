const mongoose = require('mongoose');


const discussionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String },
  hashtags: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  viewCount: { type: Number, default: 0 },
}, { timestamps: true });

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
