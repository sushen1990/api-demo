'use strict';
const express = require("express");
const router = express.Router();
const request = require('request');
const soap = require('soap');
const crypto = require('crypto');
const Helper = require('../../common/helper') ;
const veryfiCodeDB = require("../../models/veryfiCodeModel.js")

const Core = require('@alicloud/pop-core');

 //  用户获取验证码
 router.post("/sendVeryfiCode", (req,res)=>{
	 let mobile = req.body.mobile ;
	 let modelId = req.body.modelId ;
	 if (!mobile || mobile == "" || mobile == undefined) {
	     return res.status(400).json({msg: "手机号码不能为空！", data:null})
	 } ;
	 	if (!modelId || modelId == "" || modelId == undefined) {
	     return res.status(400).json({msg: "关键值不能为空！", data:null})
	 } ;
	 let veryfiCode = '' ;
	 veryfiCode = Helper.int6() ;
	 	 
	var client = new Core({
	  accessKeyId: '<accessKeyId>',
	  accessKeySecret: '<accessSecret>',
	  endpoint: 'https://dysmsapi.aliyuncs.com',
	  apiVersion: '2017-05-25'
	});

	var params = {
	  "PhoneNumbers": mobile,
	  "SignName": "信天游",
	  "TemplateCode": "SMS_163480790",
	  "TemplateParam": '"{\"code\":\"'+veryfiCode+'\"}"';
	}

	var requestOption = {
	  method: 'POST'
	};

	client.request('SendSms', params, requestOption).then((result) => {
	  veryfiCodeDB.add()
	  console.log(JSON.stringify(result));
	}, (ex) => {
	  console.log(ex);
	})
	 

 })


module.exports = router;