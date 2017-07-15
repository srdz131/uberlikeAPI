/*jshint esversion:6*/
const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
  res.send('hi you are at wrong place, try /api route');
});

module.exports = router;
