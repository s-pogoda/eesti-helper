const express = require('express');
const router = express.Router();
const Quiz = require('../apis/quiz');

router.get('/', Quiz.list);
router.post('/', Quiz.result);

module.exports = router;