const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const uniqueValidator = require('mongoose-unique-validator')

usersRouter.get('/', async (request, response) => {
    const users = await User
      .find({}).populate('blogs')
    response.json(users)
  })

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (username && password !== '') {
    if (username.length < 3) return response.status(400).json({
      error: 'Username must be at least 3 characters long.'
    })
    if (password.length < 3) return response.status(400).json({
      error: 'Username must be at least 3 characters long.'
    })
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
    } catch (error) {
      if (error.name = "ValidationError") {
      return response.status(409).json({ error: error.message})
      }
      else {
        throw error
      }
    }
  } else {
    return response.status(400).json({
      error: 'Both username and password must be provided.'
    })
  }
})

module.exports = usersRouter