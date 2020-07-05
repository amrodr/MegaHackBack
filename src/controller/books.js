'use strict'

const mongoose = require('mongoose');
const repository = require('../repositories/book');
const _ = require('lodash');

exports.getBooks = async (req, res) => {
    const books = await repository.get({})
        .then(success => {
            return success;
        });

    const formatBooks = _.chain(books)
        .groupBy("gender._id")
        .map((value, key) => ({ category: key.name, books: value }))
        .value();

    for (const book of formatBooks) {
        book.category = book.books[0].gender.name;
    }

    res.status(200).send(formatBooks)
}

exports.getBooks = async (req, res) => {
    const filter = {};
    if (req.params.name) {
        filter.name = new RegExp(req.params.name, 'i');
    }

    const books = await repository.get(filter).then(success => {
        return success;
    });

    const formatBooks = _.chain(books)
        .groupBy("gender._id")
        .map((value, key) => ({ category: key.name, books: value }))
        .value();

    for (const book of formatBooks) {
        book.category = book.books[0].gender.name;
    }

    res.status(200).send(formatBooks)
}

exports.getBookById = async (req, res) => {
    await repository.getById()
        .then(book => (res.status(200).send(book)))
}

exports.addComment = async (req, res) => {
    const bookId = req.params.id;
    const comment = req.body.comment;

    if (!bookId || !comment)
        return res.status(400).send('Missing parameters');

    await repository.addComment(bookId, comment)
        .then(() => (res.status(200).send('Commet Added')))
}

exports.registerBook = async (req, res) => {
    await repository.create(req.body)
        .then(() => {
            res.status(201).send({ message: "Book resgiter" })
        }).catch(() => {
            res.status(400).send({ message: "Error while register book" })
        });
}
