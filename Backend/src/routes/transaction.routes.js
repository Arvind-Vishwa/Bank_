const express=require("express");

const router=express.Router();
const {authMiddleware,authSystemUserMiddleware}=require("../middleware/auth.middleware")
const {createTransaction,createInitialFundsTransaction}=require("../controllers/transaction.controller")


// create  a new transaction
router.post("/",authMiddleware,createTransaction);

// initial fund transaction from system user
router.post("/system/initial-fund",authSystemUserMiddleware,createInitialFundsTransaction);

module.exports=router;