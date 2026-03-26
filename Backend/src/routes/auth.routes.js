const express=require("express");
const router=express.Router();
const userRegisterController=require("../controllers/auth.controllers")

// api --> /api/auth/register
router.post('/register',userRegisterController)




module.exports=router;