const { urlencoded } = require('body-parser');
const express=require('express');
const app=express();
const bcrypt=require('bcrypt')
const cors=require('cors')
const db=[];
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:true}))

app.get('/users',(req,res)=>{
    res.json(db.map((user)=>user.name))
});

app.post('/sign-up',async (req,res)=>{
    const salt=await bcrypt.genSalt()
    const hashedPassword=await bcrypt.hash(req.body.password,salt)
    db.push({name:req.body.username,password:hashedPassword});
    res.status(201);
    res.send('<h1>User Created</h1>')
});

app.post('/login',async (req,res)=>{
  const password=req.body.password;
  const name=req.body.username;
  const user=db.find((user)=>user.name==name)
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
