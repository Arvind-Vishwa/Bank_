const express=require("express");

const router=express.Router();
const {authMiddleware}=require("../middleware/auth.middleware");
const {createAccountController,getUserAccountController,getAccountBalanceController}=require("../controllers/account.controllers")

router.post('/',authMiddleware,createAccountController);


// get all user logged in account
router.get("/",authMiddleware,getUserAccountController)


// GET  account/balance/account:id

router.get('/balance/:accountId',authMiddleware,getAccountBalanceController)
module.exports=router;