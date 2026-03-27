const express=require("express");
const router=express.Router();
const {userRegisterController, userLoginController}=require("../controllers/auth.controllers")

// api --> /api/auth/register
router.post('/register',userRegisterController)

// api --> /api/auth/login
router.post('/login',userLoginController);




module.exports=router;