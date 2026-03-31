const express=require("express");

const router=express.Router();
const {authMiddleware}=require("../middleware/auth.middleware")


// create  a new transaction
router.post("/",authMiddleware);


module.exports=router;