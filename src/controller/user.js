'use strict'
const repository = require('../repositories/user');

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
      if(user) {
        delete user.password;
        res.status(200).send(user)
      } else {
        res.status(400).send({ message: "Error while signIn"})
      }
    }).catch(()=> {
      res.status(500).send({ message: "Error while signIn" })
    });
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
    }).catch(()=> {
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
    if(String(reading.book) === String(bookId)) reading.favorite = !reading.favorite;    
  }

  await repository.favoriteBook(userId, user.currentReadings)
    .then(() => res.status(200).send({ message: "Favorite book" }) )
    .catch(() => res.status(500).send({ message: "Error while register book" }));

}