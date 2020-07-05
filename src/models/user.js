const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    score: {
      type: Number,
      default: 0
    },
    name: String,
    photo: String,
    currentReadings: [{
      book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
      },
      readingProgress: {
        type: Number,
      },
      favorite: {
        type: Boolean,
        default: false
      }
    }]
})

module.exports = mongoose.model('User', schema, 'user')