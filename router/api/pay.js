"use strict";
const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Helper = require('../../common/helper');
const payHelper = require('../../common/payHelper');


router.get("/test",(req,res) =>{ 
    res.json({msg:"hello q"})
})

router.get("/getOrderInfo", (req,res)=>{
	
	let order = "5cd3aec5f002b6dc1664332e";
	var time = new Date().toLocaleDateString();
	const out_trade_no = time + "-" + order.toUpperCase();
	
	if(result == ""){
		return res.status(401).json({msg: "no", data:null})
	}else {
		res.json({msg: "ok", data:result})
	}

})
module.exports = router;