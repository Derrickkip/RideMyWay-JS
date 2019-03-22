let Ajv = require('ajv')
let ajv = Ajv({ allErrors: true, removeAdditional: 'all'})
let userSchema = require('../schemas/newUser.json')
let loginSchema = require('../schemas/loginSchema.json')
let rideSchema = require('../schemas/newRide.json')

ajv.addSchema(userSchema, 'new-user');
ajv.addSchema(loginSchema, 'login-user');
ajv.addSchema(rideSchema, 'new-ride');

function errorResponse(schemaErrors) {
  let errors = schemaErrors.map((error) => {
    return {
      path: error.dataPath,
      message: error.message
    }
  })
  return {
    status: 'failed',
    errors
  }
}

const validateSchema = (schemaName) => {
  return (req, res, next) => {
    let valid = ajv.validate(schemaName, req.body)
    if (!valid) {
      return res.send(errorResponse(ajv.errors))
    }
    next()
  }
}

export default validateSchema
