const express=require("express");

const router=express.Router();
const {authMiddleware}=require("../middleware/auth.middleware");
const {createAccountController}=require("../controllers/account.controllers")

router.post('/',authMiddleware,createAccountController);


module.exports=router;