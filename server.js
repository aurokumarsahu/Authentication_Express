const { urlencoded } = require('body-parser');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const cors = require('cors')
const mongoose = require('mongoose')
const { Schema, model } = mongoose
require('dotenv').config()
const jwt = require('jsonwebtoken')

mongoose.connect(process.env.MONGO_URI)
app.use(cors())
app.use(express.json())
app.use(urlencoded({ extended: true }))

//define mongoose schema and create a model(collection)
const UserSchema = new Schema({ username: String, password: String })
const db = model('db', UserSchema)

//Sign Up endpoint
app.post('/sign-up', async (req, res) => {
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  if (await db.findOne({ username: req.body.username })) {
    res.send('User name already exists')
    res.status(400)
  }
  else {
    const user = new db({ username: req.body.username, password: hashedPassword });
    await user.save();
    res.status(201).send('User Created successfully');
  }
});

//Login endpoint
app.post('/login', async (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  const user = await db.findOne({ username: username })
  if (user == null) {
    res.status(400).send('User does not exist')
  }
  try {
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      res.status(401).send('Invalid login')
    else {
      res.status(200).send('Logged in successfully')
      jwt.sign({username:username},process.env.JWT_TOKEN,{expiresIn:60*45})
    }
  }
  catch {
    res.status(500);
  }
});

app.listen(3000, () => console.log('Server Running'));
module.exports = app
