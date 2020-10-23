const ObjectID = require('mongodb').ObjectID;
const getCollection = require('../database/database');
const searchInDictionary = require('../logic/dictionary');
const Words = {};

const prepareInput = (str) => {
    return str.replace(/\s+/g, " ").trim();
};

Words.insert = async (req, res, next) => {
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
                return next();
                //throw new Error(`404 - Not found ${fails.join()}`);
            }
        }
        res.status(200).send(fails);
    } catch (e) {
        console.error(e.message);

        // Duplicate key error could accure when user searching term not in first case condition.
        // So term will not be detected by the dublicates filter, and will be made an attempt to save it.
        if (e.message.includes('duplicate key error')) {
            return res.status(200).send(fails);
        } else {
            return next(e);
        }
    }
};

Words.find = async (req, res, next) => {
    try {
        const wordsCollection = await getCollection('words');
        const result = await wordsCollection.find().sort({ _id: -1 }).toArray();
        res.status(200).send(result);
    } catch (e) {
        return next(e);
    }
};

Words.update = async (req, res, next) => {
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
        return next(e);
    }
};

module.exports = Words;