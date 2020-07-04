const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    cover: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
    gender: {
        type: Schema.Types.ObjectId,
        ref: 'Gender',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
      type: String,
      required: true
    },
    publicationDate: {
      type: Date,
      require: true
    },
    numberPages: {
      type: Number,
      require: true
    },
    comments: [{
      type: String
    }]
})

module.exports = mongoose.model('Book', schema, 'book')