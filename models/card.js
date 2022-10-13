const Mongoose = require('mongoose');

const cardSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Mongoose.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [Mongoose.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model('card', cardSchema);
