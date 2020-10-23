const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const port = process.env.PORT || 3000;
const wordsRouter = require('./routes/words');
const tagsRouter = require('./routes/tags');
const quizRouter = require('./routes/quiz');

const cors = require('cors');
const app = express();
app.use(cors());

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/words', wordsRouter);
app.use('/tags', tagsRouter);
app.use('/quiz', quizRouter);

app.use(function (req, res, next) {
  next(createError(404, "This page does not exist."));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(port);
