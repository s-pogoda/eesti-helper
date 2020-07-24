const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
// const cors = require('cors');

const db = require('../public/javascripts/database');
const dictionary = require('./dictionary');

router.post('/insert', async (req, res) => {
    const _list = req.body;

    const _words = [], _fails = [];
    try {
        await Promise.all(_list.map(async (name) => {
            try {
                const word = await dictionary(name);
                _words.push(word);
            } catch (e) {
                console.error(e.message);
                _fails.push(name);
            }
        }));

        const _db = await db();
        const _collection = _db.collection('words');
        await _collection.insertMany(_words, { ordered: false });
        res.status(200).send(_fails);

    } catch (e) {
        console.error("ERROR: " + e.message);
        //TODO: re-think errors handling
        let status = e.message.includes('E11000 duplicate key error collection') ? 200 : 500;
        status = e.message.includes('404') ? 404 : status;

        res.status(status).send(_fails);
    }
});

router.get('/find', async (req, res) => {
    const _query = JSON.parse(req.query.q) || {};
    const _filter = JSON.parse(req.query.f) || {};

    try {
        const _db = await db();
        const _collection = _db.collection('words');

        const _result = await _collection.find(_query, _filter).toArray();
        res.status(200).send(_result);
    } catch (e) {
        console.error(e.message);
        res.status(500).send();
    }
});

router.post('/quiz-result', async (req, res) => {
    // array of origin words
    const _words = req.body.words;
    // object of answers
    const _answers = req.body.answers;
    const _failed = [], _failedIds = [], _fixedIds = [];

    //compare user answers with correct values
    for (const id in _answers) {
        const word = _words.find((item) => item._id === id);
        if (word.firstCase !== _answers[id].firstCase
            || word.secondCase !== _answers[id].secondCase
            || word.thirdCase !== _answers[id].thirdCase) {
            word.failed = true;
            _failedIds.push(ObjectID(word._id));
            _failed.push(word);
        } else {
            // if you failed word before, but now not --> change failed status
            if (word.failed) _fixedIds.push(ObjectID(word._id));
        }
    }

    //update db
    try {
        const _db = await db();
        const _collection = _db.collection('words');
        if (_fixedIds.length) {
            await _collection.updateMany({ _id: { $in: _fixedIds } }, { $set: { "failed": false } });
        }
        if (_failedIds.length) {
            await _collection.updateMany({ _id: { $in: _failedIds } }, { $set: { "failed": true } });
        }
    } catch (e) {
        console.error(e.message);
        res.status(500).send([]);
    }

    res.status(200).send(_failed);
});

module.exports = router;