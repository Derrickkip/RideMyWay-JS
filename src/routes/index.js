import users from '../controllers/users';

module.exports = (app) => {
  app.get('/api/', (req, res) => {
    res.send('This route is not in use');
  });

  app.post('/api/signup', users.signUp)

}