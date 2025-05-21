const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    UID:{
        type:Number,
        required:true,
        unique:true,
        index:true
    },
    past:[{
        url: { type: String, required: true },
        tag: { type: String } 
    }]
})
module.exports=mongoose.model("User",userSchema);