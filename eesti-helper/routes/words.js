const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;

const getCollection = require('../database/database');
const searchInDictionary = require('../logic/dictionary');

const prepareInput = (str) => {
    return str.replace(/\s+/g, " ").trim();
};

router.post('/insert', async (req, res) => {
    const list = req.body.map((item) => prepareInput(item));
    const fails = [];
    try {
        const wordsCollection = await getCollection('words');
        const dublicates = await wordsCollection.find({ firstCase: { $in: list } })
            .map((item) => item.firstCase).toArray();
        const words = [];
        await Promise.all(list.filter((item) => !dublicates.includes(item))
            .map(async (name) => {
                try {
                    const word = await searchInDictionary(name);
                    words.push(word);
                } catch (e) {
                    console.error(e.message);
                    fails.push(name);
                }
            })
        );

        if (words.length) {
            await wordsCollection.insertMany(words, { ordered: false });
        } else {
            if (fails.length) {
                throw new Error(`404 - Not found ${fails.join()}`);
            }
        }
        res.status(200).send(fails);
    } catch (e) {
        console.error(e.message);

        // Duplicate key error could accure when user searching term not in first case condition.
        // So term will not be detected by the dublicates filter, and will be made an attempt to save it.
        if (e.message.includes('duplicate key error')) {
            res.status(200).send(fails);
        } else {
            let status = e.message.includes('404') ? 404 : 500;
            res.status(status).end();
        }
    }
});

router.get('/tags', async (req, res) => {
    try {
        const tagsCollection = await getCollection('tags');
        const result = await tagsCollection.find().sort({ tag: 1 }).map(item => item.tag).toArray();
        res.status(200).send(result);
    } catch (e) {
        console.error(e.message);
        res.status(500).end();
    }
});

router.get('/find', async (req, res) => {
    try {
        const wordsCollection = await getCollection('words');
        const result = await wordsCollection.find().sort({ _id: -1 }).toArray();
        res.status(200).send(result);
    } catch (e) {
        console.error(e.message);
        res.status(500).end();
    }
});

router.get('/quiz-list', async (req, res) => {
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
        console.error(e.message);
        res.status(500).end();
    }
});

router.post('/update/:id', async (req, res) => {
    const { tags, translation } = req.body;
    const query = {};

    try {
        if (tags) {
            query.tags = tags;
            const tagsCollection = await getCollection('tags');
            const dublicates = await tagsCollection.find({ tag: { $in: tags } })
                .map((item) => item.tag)
                .toArray();
            const filteredTags = await tags.filter((item) => !dublicates.includes(item))
                .map((item) => ({ tag: item }));

            if (filteredTags.length) {
                await tagsCollection.insertMany(filteredTags, { ordered: false });
            }
        }

        const wordsCollection = await getCollection('words');
        if (translation) {
            // add new translation at the top of array
            const word = await wordsCollection.findOne({ _id: ObjectID(req.params.id) });
            word.translation.unshift(translation);
            query.translation = [...new Set(word.translation)];
        }

        await wordsCollection.updateOne({ _id: ObjectID(req.params.id) }, { $set: query });
        res.status(200).end();

    } catch (e) {
        console.error(e.message);
        res.status(500).end();
    }
});

router.post('/quiz-result', async (req, res) => {
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
        console.error(e.message);
        res.status(500).end();
    }
});

module.exports = router;