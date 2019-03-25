import 'dotenv/config';

const nJwt = require('njwt');

const verifyToken = async (req, res, next) => {
  const tokenString = req.header('Authorization');

  if (!tokenString) {
    return res.status(401).send({
      status: 'unauthorized',
      message: 'Token not provided',
    });
  }

  if (tokenString.slice(0, 6) !== 'Bearer') {
    return res.status(400).send({
      status: 'error',
      message: 'Token provided is not in the correct format',
    });
  }

  const token = tokenString.slice(7);
  const signingKey = process.env.SECRET_KEY;

  await nJwt.verify(token, signingKey, (err, verifiedJwt) => {
    if (err) {
      return res.status(401).send({
        status: 'unauthorized',
        message: 'invalid token provided',
      });
    }
    req.context.user = verifiedJwt.body.sub;
    return true;
  });
  return next();
};

export default verifyToken;
