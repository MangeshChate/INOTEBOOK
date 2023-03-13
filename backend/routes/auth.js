const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'MangeshisagoodBoy'
//Create a User using : POST "/api/auth/createuser".Doesnt require Auth
router.post(
  '/createuser',
  [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password must be atleast 5 Character').isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are errors return bad request and errors

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }
    //cheack user with email already exits
    try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res
          .status(400)
          .json({ error: 'Sorray the user with this email already exists' })
      }
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password, salt)
      //create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })
      const data = {
        id: user.id,
      }
      const authToken = jwt.sign(data, JWT_SECRET)
      //   console.log(jwtData)
      //   res.json(user)
      res.json({ authToken })
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Some errored occurd')
    }
  },
)

//Athutenicate user
router.post(
  '/login',
  [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'password cannot be blank').exists(),
    
  ],
  async (req, res) => {
    // if there are errors return bad request and errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() })
    }

    const { email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ error: 'Please try to login with correct creaditionals!' })
      }
      const passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: 'Please try to login with correct creaditionals!' })
      }
      const data= {
        id: user.id,
      }

      const authToken = jwt.sign(data, JWT_SECRET)
      res.send({authToken})
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Interel server error , please try again later  .')
    }
  },
)
module.exports = router
