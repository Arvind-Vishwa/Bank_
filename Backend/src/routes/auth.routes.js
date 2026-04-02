const express=require("express");
const router=express.Router();
const {userRegisterController, userLoginController,logoutController}=require("../controllers/auth.controllers")

// api --> /api/auth/register
router.post('/register',userRegisterController)

// api --> /api/auth/login
router.post('/login',userLoginController);

// logout routes --> api/auth/logout
router.post('/logout',logoutController)


module.exports=router;