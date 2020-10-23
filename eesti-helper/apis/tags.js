const getCollection = require('../database/database');

const Tags = {};

Tags.list = async (req, res, next) => {
    try {
        const tagsCollection = await getCollection('tags');
        const result = await tagsCollection.find().sort({ tag: 1 }).map(item => item.tag).toArray();
        res.status(200).send(result);
    } catch (e) {
        return next(e);
    }
};

module.exports = Tags;