import 'dotenv/config';
import * as Joi from 'joi-browser';
import * as schemas from '../middlewares/schemas/index';

const User = require('../../models').User;
const bcrypt = require("bcrypt");

User.sync()

module.exports = {
  signUp: (req, res) => {
    Joi.validate(req.body, schemas.userSchema, async (err, value) => {
      if(err) {
        return res.status(400).send({status: "error", message: err.details[0].message})
      }
      const {username, email, phonenumber, password} = value;
      console.log(email)

      const emailExists = await User.findOne({where: {email}})
      if (emailExists){
        return res.status(400).send({status: "unsuccessful", message: "User with this email already exists"})
      }

      const usernameExists = await User.findOne({where: {username}})
      if (usernameExists) {
        return res.status(400).send({status: "unsuccessful", message: "User with this username already exists"})
      }

      const phoneNumberExists = await User.findOne({where: {phonenumber}})
      if (phoneNumberExists) {
        return res.status(400).send({status: "unsuccessful", message: "User with this phone number already exists"})
      }
      
      const hash = parseInt(process.env.HASH)
      const passwordHash = bcrypt.hashSync(password, hash);
      

      User.create({email, username, phonenumber, password: passwordHash})
      .then((user) => {
        
        const newUser = user.toJSON();
        delete newUser.password
       
        return res.status(201).send({data: newUser, status: 'success'})
      });

    });
  }
}