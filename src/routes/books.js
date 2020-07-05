'use strict'

const express = require('express');
const books = require('../controller/books');
const router = express.Router();

router.get('/', books.getBooks);
router.get('/:bookId', books.getBookById);
router.get('/filtered/:search', books.getFilteredBooks)
router.post('/', books.registerBook);
router.patch('/comment/:id', books.addComment);

module.exports = router;