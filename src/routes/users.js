import Router from 'express';
import validateSchema from '../schemas';
import {checkUser, checkUserPassword} from '../helpers/validators/signupValidator';
import { generateToken } from '../helpers/tokenGenerator';

const bcrypt = require("bcrypt");
const router = Router()


router.post('/signup', validateSchema('new-user'), checkUser(), async (req, res) => {

  const {email, username, phonenumber, password} = req.body;

  const hash = parseInt(process.env.HASH)
  const passwordHash = bcrypt.hashSync(password, hash);

  const user = await req.context.models.User.create({
    email,
    username,
    phonenumber,
    password: passwordHash
  });

  const newUser = user.toJSON();

  delete newUser.password

  return res.status(201).send({"status": "success", "data": newUser});
});

router.post('/login', validateSchema('login-user'), async (req, res) => {

    let user = await req.context.models.User.findOne({where: {email : req.body.email}})
    if (!user) {
      return res.status(404).send({'status': 'error', "message": "email does not exist"})
    }

    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(400).send({'status': 'error', "message": "Password is wrong"})
    }

    const token = generateToken(user.email);

    user = user.toJSON()
    delete user.password
    
    user['token'] = token

    return res.send({'status':'Successful Login', 'data': user})
});

export default router;