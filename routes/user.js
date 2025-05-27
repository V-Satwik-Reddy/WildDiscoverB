const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=require('../model/user.js');
const dotenv=require('dotenv');

router.get('/',(req,res)=>{
    res.json("Hello from user");
})

router.get('/history', async (req, res) => {
  try {
    const { phone } = req.query;
    const phoneNum = Number(phone);
if (isNaN(phoneNum)) {
  return res.status(400).json({ message: "Invalid phone number format" });
}
const user = await User.findOne({ phone: phoneNum }).select("past").lean();

    if (!user) {
      return res.status(404).json({ message: "No images found" });
    }
    res.status(200).json({ message: "Images found", past: user.past });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports =router;