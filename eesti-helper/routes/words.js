const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;
// const cors = require('cors');

const db = require('../public/javascripts/database');
const dictionary = require('./dictionary');

router.post('/insert', async (req, res) => {
    const _list = req.body;

    try {

        const _words = [];
        await Promise.all(_list.map( async (name) => {
            const word = await dictionary(name);
            _words.push(word);
        }));

        console.log(JSON.stringify(_words));

        const _db = await db();
        const _collection = _db.collection('words');
        await _collection.insertMany( _words, { ordered: false } );
        res.status(200).send();

    } catch(e) {
        if( e.message.includes('E11000 duplicate key error collection') ) {
            return res.status(200).send();
        }

        console.error(e.message);
        res.status(500).send();
    }    
});

//TODO return PUT
// router.put('/update', async (req, res) => {
router.post('/update', async (req, res) => {
    const _ids = req.body.ids.map((id) => ObjectID(id) );
    const _value = req.body.value;

    try {
        const _db = await db();
        const _collection = _db.collection('words'); 

        await _collection.updateMany( { _id: { $in: _ids } }, { $set: _value } );
        res.status(200).send();

    } catch (e) {
        console.log(e.message);        
        res.status(500).send();
    }    
})

router.get('/find', async ( req, res ) => {
    const _query = JSON.parse(req.query.q) || {};
    const _filter = JSON.parse(req.query.f) || {};

    try {
        const _db = await db();
        const _collection = _db.collection('words'); 

        const _result = await _collection.find(_query, _filter).toArray();
        res.status(200).send(_result);
    } catch (e) {
        console.log(e.message);        
        res.status(500).send();
    }
});

module.exports = router;