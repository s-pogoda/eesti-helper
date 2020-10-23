const express = require('express');
const router = express.Router();
const Tags = require('../apis/tags');

router.get('/', Tags.list);

module.exports = router;