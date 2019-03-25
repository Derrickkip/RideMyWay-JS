const Ajv = require('ajv');

const ajv = Ajv({ allErrors: true, removeAdditional: 'all' });
const userSchema = require('../schemas/newUser.json');
const loginSchema = require('../schemas/loginSchema.json');
const rideSchema = require('../schemas/newRide.json');
const responseSchema = require('../schemas/responseSchema.json');
const carSchema = require('../schemas/cars.json');

ajv.addSchema(userSchema, 'new-user');
ajv.addSchema(loginSchema, 'login-user');
ajv.addSchema(rideSchema, 'new-ride');
ajv.addSchema(responseSchema, 'response');
ajv.addSchema(carSchema, 'car');

function errorResponse(schemaErrors) {
  const errors = schemaErrors.map(error => ({
    path: error.dataPath,
    message: error.message,
  }));
  return {
    status: 'failed',
    errors,
  };
}

const validateSchema = schemaName => (req, res, next) => {
  const valid = ajv.validate(schemaName, req.body);
  if (!valid) {
    return res.send(errorResponse(ajv.errors));
  }
  return next();
};

export default validateSchema;
