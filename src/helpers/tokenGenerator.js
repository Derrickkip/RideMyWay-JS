import 'dotenv/config';
const nJwt = require('njwt');

const generateToken = (email) => {
  const claims = {
    iss: "http://localhost:3000",
    sub: email,
    scope: "self, admins"
  }

  const signingKey = process.env.SECRET_KEY;
  const jwt = nJwt.create(claims, signingKey);
  jwt.setExpiration(new Date().getTime() + (30*24*60*60*1000))
  const token = jwt.compact();
  
  return token
}


export {generateToken};