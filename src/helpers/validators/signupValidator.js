
const checkUser = () => {
  return async (req, res, next) => {
    let User = await req.context.models.User.findOne({where: {email : req.body.email}})
    if (User) {
      return res.status(400).send({
        "status": "error",
        "message": 'The email is already in use'})
    }

    User = await req.context.models.User.findOne({where: {username : req.body.username}})
    if (User) {
      return res.status(400).send({
        "status": "error",
        "message": 'The username is already in use'})
    }

    User = await req.context.models.User.findOne({where: {phonenumber : req.body.phonenumber}})
    if (User) {
      return res.status(400).send({
        "status": "error",
        "message": 'The phonenumber exists in the system'})
    }


    next()
  } 
}



export {checkUser};