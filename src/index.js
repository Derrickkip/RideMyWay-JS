import 'dotenv/config';
import routes from './routes';
import db from './models';
import verifyToken from './helpers/verifyToken';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(async (req, res, next) => {
  req.context = {
    models: db,
  };

  next();
});

app.use('/api/auth', routes.users);

app.use('/api/rides', verifyToken, routes.rides);

app.use('/api/cars', verifyToken, routes.cars)

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
});
