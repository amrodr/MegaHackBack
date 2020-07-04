'use strict'

const express = require('express');
const books = require('../controller/books');
const router = express.Router();

router.get('/:name?', books.getBooks);
router.get('/:id', books.getBookById);
router.post('/', books.registerBook);
router.patch('/comment/:id', books.addComment);

module.exports = router;