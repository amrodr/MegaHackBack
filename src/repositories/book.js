'use strict'

const mongoose = require('mongoose');
const Book = require('../models/books');
const Gender = require('../models/gender');
 
exports.get = async (filter) => {
    return await Book.find(filter)
      .populate('gender', {
        name: 1
      })
      .lean();
}

exports.getById = (bookId) => {
    return Book.findById(bookId);
}

exports.addComment = (bookId, comment) => {
  return Book.updateOne({ _id: bookId }, { $push: { comments: comment } })
}

exports.create = (body) => {
    let book = new Book(body);

    return book.save();
}