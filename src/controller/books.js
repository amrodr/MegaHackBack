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

exports.getBooksFinalized = async (req, res) => {
    const book = await repository.getById(req.params.bookId);

    const user = await User.getUser({ _id: '5efff5e5119b2c438a7feed1' });
    user.currentReadings = user.currentReadings || [];
    const userBookIndex = user.currentReadings.findIndex(element => String(element.book) === String(req.params.bookId));

    if (userBookIndex === -1) {
        res.status(404).json({ message: 'Error' });
    }

    user.score = user.score || 0;
    user.score += 50;
    user.currentReadings[userBookIndex].chapterIndex = user.currentReadings[userBookIndex].chapterIndex || [];
    user.currentReadings[userBookIndex].chapterIndex.push(book.chapters.length -1)
    user.currentReadings[userBookIndex].readingProgress = 100;
    user.currentReadings[userBookIndex].feedback = req.params.feedback;

    await User.update(user);

    res.status(200).json({ message: 'ok' });
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
    const book = await repository.getById(req.params.bookId);
    book.chapter = book.chapters[req.params.chapterId];

    const user = await User.getUser({ _id: '5efff5e5119b2c438a7feed1' });
    user.currentReadings = user.currentReadings || [];
    const userBookIndex = user.currentReadings.findIndex(element => String(element.book) === String(req.params.bookId));
    if (userBookIndex === -1) {
        user.currentReadings.push({
            book: req.params.bookId
        });

        await User.update(user);
    }

    if (!book.chapter) {
        res.status(404).send(book);
        return;
    }

    book.chapter.readingUsers = [{
        userPicture: 'user-2.png',
        name: 'Laura'
    }, {
        userPicture: 'user-3.png',
        name: 'Pedro'
    }, {
        userPicture: 'user-4.png',
        name: 'Antonio'
    }, {
        userPicture: 'user-6.png',
        name: 'Luis'
    }];

    if (req.params.chapterId > 0) {
        for (const reading of user.currentReadings) {
            if (String(reading.book) !== String(req.params.bookId)) {
                continue;
            }

            reading.chapterIndex = reading.chapterIndex || [];
            if (reading.chapterIndex.includes(req.params.chapterId)) {
                continue;
            }

            if (!reading.chapterIndex.includes(req.params.chapterId - 1)) {
                reading.chapterIndex.push(req.params.chapterId - 1);
            }

            reading.readingProgress = ((100 / book.chapters.length) * req.params.chapterId);
            break;
        }
    
        await User.update(user);
    }

    res.status(200).send(book);
}

exports.patchChapterByBookDialog = async (req, res) => {
    const book = await repository.getById(req.params.bookId);
    book.chapter = book.chapters[req.params.chapterId];

    const user = await User.getUser({ _id: '5efff5e5119b2c438a7feed1' });

    if (book.chapter.dialog && book.chapter.dialog.answers) {
        const answer = book.chapter.dialog.answers.find(element => String(element.alternative.replace('?', '')) === String(req.params.answer));
        // user.currentReadings = user.currentReadings || [];
        // const userBook = user.currentReadings.findIndex(element => String(element.book) === String(req.params.bookId));
        // userBook.chapterIndex = userBook.chapterIndex || [];

        if (answer && answer.correct && book.chapter.dialog.points) {
            user.score += Number(book.chapter.dialog.points);
        }
    }

    await User.update(user);

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
