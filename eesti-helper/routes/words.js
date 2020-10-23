const express = require('express');
const router = express.Router();
const Words = require('../apis/words');
const ObjectID = require('mongodb').ObjectID;

const getCollection = require('../database/database');
const searchInDictionary = require('../logic/dictionary');

const prepareInput = (str) => {
    return str.replace(/\s+/g, " ").trim();
};

router.post('/insert', Words.insert);

router.get('/tags', Words.tags);

router.get('/find', Words.find);

router.get('/quiz-list', Words.quiz);

router.post('/update/:id', Words.update);

router.post('/quiz-result', Words.result);

module.exports = router;