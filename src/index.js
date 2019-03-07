import 'dotenv/config';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

require('./routes/index')(app)

module.exports = app.listen(3000, () => {
  console.log('Listening on port 3000');
})