const express = require('express');
const router = express.Router();

const db = require('../public/javascripts/database');
// const assert = require('assert');


//TODO: crawl https://sonaveeb.ee/ for words foms, types, translation
router.post('/insert', async (req, res) => {
    const list = req.body;

    try {
        const _db = await db();
        const _collection = _db.collection('words');
        await _collection.insertMany( list, { ordered: false } );
        res.status(200).send();

    }
    catch(e) {
        // TODO: think about return case, when added all except dublicates
        console.log(e.message);
        res.status(500).send();
    }    
});


module.exports = router;