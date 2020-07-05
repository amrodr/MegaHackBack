'use strict'
const repository = require('../repositories/user');

const levelProgress = (user) => {
    const data = user.score < 50 ? 0 : user.score / 50

    user.levelProgress = data > 0 ? Number(String(data).split('.')[1]) : data;
    user.level = data > 0 ? Number(String(data).split('.')[0]) : data;

    return user;
}

exports.singIn = async (req, res) => {
    let filter = {};
    const username = req.body.username;
    const password = req.body.password;

    if (!username && !password) return res.status(400).send({ message: 'Missing paramenters' });

    filter = {
        username,
        password
    }

    await repository.get(filter)
        .then(user => {
            if (user) {
                delete user.password;
                res.status(200).send(user)
            } else {
                res.status(400).send({ message: "Error while signIn" })
            }
        }).catch(() => {
            res.status(500).send({ message: "Error while signIn" })
        });
}

exports.get = async (req, res) => {
    let filter = {
        _id: '5efff5e5119b2c438a7feed1'
    }

    const user = await repository.get(filter);

    res.status(200).json(levelProgress(user));
}

exports.startReading = async (req, res) => {
    const userId = req.params.id;
    const bookId = req.body.bookId;

    if (!userId || !bookId)
        return res.status(400).send({ message: 'Missing paramenters' });

    const readingStart = {
        book: bookId,
        readingProgress: 0
    }

    await repository.registerReadStartRecord(userId, readingStart)
        .then(() => {
            res.status(200).send({ message: 'Register starting reading book' })
        }).catch(() => {
            res.status(500).send({ message: "Error while register book" })
        });
}

exports.favoriteBook = async (req, res) => {
    const userId = req.params.id;
    const bookId = req.body.bookId;

    if (!userId || !bookId)
        return res.status(400).send({ message: 'Missing paramenters' });

    const user = await repository.getUser({ _id: userId }).then(success => {
        return success;
    });

    for (const reading of user.currentReadings) {
        if (String(reading.book) === String(bookId)) reading.favorite = !reading.favorite;
    }

    await repository.favoriteBook(userId, user.currentReadings)
        .then(() => res.status(200).send({ message: "Favorite book" }))
        .catch(() => res.status(500).send({ message: "Error while register book" }));

}