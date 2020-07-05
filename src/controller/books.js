'use strict'

const mongoose = require('mongoose');
const repository = require('../repositories/book');
const User = require('../repositories/user');
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

exports.getBookById = async (req, res) => {
    await repository.getById(req.params.bookId)
        .then(book => {
            book.gender = book.gender.name;
            res.status(200).send(book)
        });
}

exports.getFilteredBooks = async (req, res) => {
    const filter = {};

    if (req.params.search && req.params.search !== 'all') {
        filter.name = new RegExp(req.params.search, 'i');
    }

    const books = await repository.get(filter).then(success => {
        return success;
    });

    const formatBooks = _.chain(books)
        .groupBy('gender._id')
        .map((value, key) => ({ category: key.name, books: value }))
        .value();

    for (const book of formatBooks) {
        book.category = book.books[0].gender.name;
    }

    res.status(200).send(formatBooks)
}

exports.getChapterByBook = async (req, res) => {
    await repository.getById(req.params.bookId)
        .then(book => {
            book.chapter = book.chapters[req.params.chapterId];

            book.chapter.readingUsers = [{
                userPicture: 'https://w7.pngwing.com/pngs/99/998/png-transparent-computer-icons-user-profile-50-face-heroes-monochrome.png',
                name: 'Laura'
            }, {
                userPicture: 'https://w7.pngwing.com/pngs/99/998/png-transparent-computer-icons-user-profile-50-face-heroes-monochrome.png',
                name: 'Pedro'
            }, {
                userPicture: 'https://w7.pngwing.com/pngs/99/998/png-transparent-computer-icons-user-profile-50-face-heroes-monochrome.png',
                name: 'Antonio'
            }, {
                userPicture: 'https://w7.pngwing.com/pngs/99/998/png-transparent-computer-icons-user-profile-50-face-heroes-monochrome.png',
                name: 'Luis'
            }];

            res.status(200).send(book);
        });
}

exports.patchChapterByBookDialog = async (req, res) => {
    const book = await repository.getById(req.params.bookId);
    book.chapter = book.chapters[req.params.chapterId];

    if (book.chapter.dialog && book.chapter.dialog.answers) {
        const answer = book.chapter.dialog.answers.find(element => String(element.alternative.replace('?', '')) === String(req.params.answer));

        if (answer && answer.correct && book.chapter.dialog.points) {
            await User.updateScore('5efff5e5119b2c438a7feed1', book.chapter.dialog.points);
        }
    }

    res.status(200).json({ message: 'Resposata salva!' });
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
