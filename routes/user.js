const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require('../model/user.js');
const dotenv=require('dotenv');

router.get('/',(req,res)=>{
    res.json("Hello from user");
})

router.post('/newUser', async (req, res) => {
    try {
        const { name, phone } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        const newUser = new User({ name, phone });
        await newUser.save();

        res.status(201).json({ message: "User created" });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "User already exists" });
        }
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports =router;