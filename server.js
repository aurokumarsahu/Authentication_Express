const { urlencoded } = require('body-parser');
const express=require('express');
const app=express();
const bcrypt=require('bcrypt')
const db=[];
app.use(express.json())
app.use(urlencoded({extended:true}))
app.get('/users',(req,res)=>{
    res.json(db.map((user)=>user.name));
    res.json(db)
});

app.post('/sign-up',async (req,res)=>{
    const salt=await bcrypt.genSalt()
    const hashedPassword=await bcrypt.hash(req.body.password,salt)
    db.push({name:req.body.username,password:hashedPassword});
    res.status(201);
    res.send('<h1>User Created</h1>')
    console.log(req.body);
});

app.listen(3000);
