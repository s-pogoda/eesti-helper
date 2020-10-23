const express = require('express');
const router = express.Router();
const Words = require('../apis/words');

router.post('/', Words.insert);
router.get('/', Words.find);
router.put('/:id', Words.update);

module.exports = router;