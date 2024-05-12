const { urlencoded } = require('body-parser');
const express=require('express');
const app=express();
const bcrypt=require('bcrypt')
const cors=require('cors')
const mongoose=require('mongoose')
const {Schema, model}=mongoose
require('dotenv').config()


mongoose.connect(process.env.MONGO_URI)
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:true}))

//define mongoose schema and create a model(collection)
const UserSchema=new Schema({name:String,password:String})
const db=model('db',UserSchema)

// Get Users List
/*app.get('/users',async (req,res)=>{
   const user=await db.find({},{name:1})
    res.json(user)
});
*/
//Sign Up endpoint
app.post('/sign-up',async (req,res)=>{
    const salt=await bcrypt.genSalt()
    const hashedPassword=await bcrypt.hash(req.body.password,salt)
    if(await db.findOne({name:req.body.username})){
    res.send('<h1>User name already exists</h1>')
    res.status(400)
    }
    else{
    const user=new db({name:req.body.username,password:hashedPassword});
    await user.save();
    res.status(201);
    res.send('<h1>User Created</h1>')
    }
});

//Login endpoint
app.post('/login',async (req,res)=>{
  const password=req.body.password;
  const name=req.body.username;
  const user=await db.findOne({name:name})
  if(user==null)
  res.send('<h1>User does not exist</h1>')
  try{
  const passwordCheck= await bcrypt.compare(password,user.password);
  if(!passwordCheck)
  res.send('<h1>Invalid login</h1>')
    else
    res.send('<h1>Logged in successfully</h1>')
  }
  catch{
    res.status(500);
  }
});

app.listen(3000,()=>console.log('Server Running'));
module.exports=app
