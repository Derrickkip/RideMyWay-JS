const Joi = require('joi');

const userSchema = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  phonenumber: Joi.string().regex(/^[0-9]{3,30}$/).required(),
  password: Joi.string().required()
});

module.exports = {
  userSchema
}