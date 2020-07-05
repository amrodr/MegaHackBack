'use strict'

const express = require('express');
const user = require('../controller/user');
const router = express.Router();

router.post('/', user.singIn);
router.get('/', user.get);
router.patch('/:id', user.startReading);
router.patch('/favorite/:id', user.favoriteBook);

module.exports = router;