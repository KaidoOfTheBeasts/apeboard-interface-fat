const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const fatBscRouter = require('./routes/fatBsc');
const app = express();
app.use(cors({
  'origin': '*',
  'methods': 'GET,PUT,POST,DELETE',
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/fatBsc/', fatBscRouter);

app.use('*', function(req, res){
  res.status(404).send({
    "statusCode": 404,
    "message": `Cannot ${req.method} ${req.params[0]}`,
    "error": "Not Found"
  });
});

// noinspection JSUnusedLocalSymbols
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500);
  res.send({
    message: "Internal server error",
    statusCode: 500,
  });
});

module.exports = app;
