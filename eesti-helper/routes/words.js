const express = require('express');
const router = express.Router();
const db = require('../public/javascripts/database');

//TODO: crawl https://sonaveeb.ee/ for words foms, types, translation
router.post('/insert', async (req, res) => {
    const _list = req.body;

    try {
        const _db = await db();
        const _collection = _db.collection('words');
        await _collection.insertMany( _list, { ordered: false } );
        res.status(200).send();

    } catch(e) {
        if( e.message.includes('E11000 duplicate key error collection') ) {
            return res.status(200).send();
        }

        console.log(e.message);
        res.status(500).send();
    }    
});

router.get('/find-failed', async (req, res) => {
    try{
        const _db = await db();
        const _collection = _db.collection('words');

        const _result = await _collection.find({failed: true}).toArray();
        res.status(200).send(_result);

    } catch (e) {
        console.log(e.message);        
        res.status(500).send();
    }
});

router.get('/find-latest-for-quiz', async (req, res) => {
    const _limit = parseInt(req.query.limit);

    try{
        const _db = await db();
        const _collection = _db.collection('words');

         // find({}, { sort:{_id: -1}, limit:_limit }).toArray();
        const _result = await _collection.find().sort({_id: -1}).limit(_limit).toArray();
        res.status(200).send(_result);

    } catch (e) {
        console.log(e.message);
        res.status(500).send();
    }
});


module.exports = router;