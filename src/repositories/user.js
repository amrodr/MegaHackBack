'use strict'

const User = require('../models/user');
const Book = require('../models/books');

exports.getUser = async (filter) => {
  return await User.findOne(filter).lean();
}

exports.get = async (filter) => {
    return await User.findOne(filter)
      .populate('currentReadings.book', {
        name: 1,
        cover: 1,
        author: 1,
      })
      .lean();
}

exports.registerReadStartRecord = async (userId, readingBook) => {
  return await User.updateOne({ _id: userId }, { $push: { currentReadings: readingBook } })
}

exports.favoriteBook = async (userId, readingBook) => {
  return await User.updateOne({ _id: userId }, { $set: { currentReadings: readingBook } })
}

exports.update = async (user) => {
  return await User.updateOne({ 
    _id: user._id 
  }, user);
}

exports.rankUsers = async () => {
  return await User.find({})
    .select('photo name score')
    .sort({ score: -1 })
    .limit(10);
}

