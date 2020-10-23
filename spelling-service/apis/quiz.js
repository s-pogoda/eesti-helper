const ObjectID = require('mongodb').ObjectID;
const getCollection = require('../database/database');
const Quiz = {};

Quiz.list = async (req, res, next) => {
    const query = JSON.parse(req.query.q) || {};
    const filter = JSON.parse(req.query.f) || {};

    try {
        const wordsCollection = await getCollection('words');
        const result = await wordsCollection.find(query, filter)
            .sort({ _id: -1 })
            .map((word) => ({ _id: word._id, type: word.type, translation: word.translation }))
            .toArray();
        res.status(200).send(result);
    } catch (e) {
        return next(e);
    }
};

Quiz.result = async (req, res, next) => {
    // array of words IDs
    const wordIds = req.body.words.map((w) => ObjectID(w._id));
    // object of answers
    const answers = req.body.answers;
    const failed = [], failedIds = [], fixedIds = [];

    try {
        const wordsCollection = await getCollection('words');
        const words = await wordsCollection.find({ _id: { $in: wordIds } }).toArray();
        //compare user answers with correct values
        for (const word of words) {
            const answer = answers[word._id];
            if (!answer || word.firstCase !== prepareInput(answer.firstCase)
                || word.secondCase !== prepareInput(answer.secondCase)
                || word.thirdCase !== prepareInput(answer.thirdCase)) {
                word.failed = true;
                failedIds.push(ObjectID(word._id));
                failed.push(word);
            } else {
                // if you failed word before, but now not --> change failed status
                if (word.failed) fixedIds.push(ObjectID(word._id));
            }
        }

        //update db
        if (fixedIds.length) {
            await wordsCollection.updateMany({ _id: { $in: fixedIds } }, { $set: { "failed": false } });
        }
        if (failedIds.length) {
            await wordsCollection.updateMany({ _id: { $in: failedIds } }, { $set: { "failed": true } });
        }
        res.status(200).send(failed);
    } catch (e) {
        return next(e);
    }
};

module.exports = Quiz;