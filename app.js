const express=require('express');
const app=express();
const mongoose=require('mongoose');
const morgan=require('morgan');
const dotenv=require('dotenv');
dotenv.config();


app.use(morgan("dev"));
app.use(express.json());


mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB connected"))
    .catch((err)=>console.log(err));

app.get('/',(req,res)=>{
    res.json("Hello World");
})


app.use("/user",require("./routes/user.js"));
app.listen(3000,()=>{
    console.log("Sever running of http://localhost:3000");
})