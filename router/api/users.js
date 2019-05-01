// const express = require("express")
// const router = express.Router()
// 
// router.get("/test",(req,res) =>{
// 	res.json({msg:"hello api"})
// })
// 
// module.exports = router;

const express = require("express")
const router = express.Router()

router.get("/",(req,res) =>{
    res.json({msg:"hello q"})
})

module.exports = router;