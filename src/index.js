import 'dotenv/config';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
import routes from './routes'
import db from './models';
import verifyToken from './helpers/verifyToken';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  req.context = {
    models: db,
  }

  next()
});

app.use('/api/users', routes.users)

app.use(verifyToken());

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  })
})

