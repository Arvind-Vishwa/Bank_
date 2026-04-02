const {transactionModel}=require("../models/transaction.models");
const accountModel=require("../models/account.models");
const ledgerModel=require("../models/ledger.models");
const emailService=require("../services/email.services")
const mongoose=require("mongoose");

/**
 * 
 * * Create a new Transaction
 *  The 10 step flow
 *  
 *  1. Validate request
 *  2. Validate idempotency key
 *  3. Check account status
 *  4. Derive sender balance from ledger
 *  5. Create transaction (Pending)
 *  6. Create DEBIT ledger entry
 *  7. Create CREDIT ledger entry
 *  8. Mark transaction COMPLETED
 *  9. Commit MongoDB session
 *  10. Send email notification
 *  
 */

async function createTransaction(req,res){

    // Validate request 

    const{ fromAccount,toAccount,amount,idempotencyKey}= req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount, toAccount, amount and idempotencyKey is required"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount
    });

    const toUserAccount=await accountModel.findOne({
        _id:toAccount
    });

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"Invalid fromAccount and toAccount"
        })
    }

    // validate idempotencyKey

    const isTransactionAlreadyExists=await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })

    if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
            res.status(200).json({
                message:"Transaction already processed",
                transaction:isTransactionAlreadyExists
            })
        }
        if(isTransactionAlreadyExists.status === "PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing "
            })
        }
        if(isTransactionAlreadyExists.status === "FAILED "){
            return res.status(500).json({
                message:"Transaction failed, please retry"
            })
        }
        if(isTransactionAlreadyExists.status === "REVERSED"){
            return res.status(500).json({
                message:"Transaction was reversed, please retry"
            })
        }
    }

    // check account status

    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message:"Both account from and to must be active "
        })
    }

    // Derive sender balance from ledger

    const balance=await fromUserAccount.getBalance();

    if(balance < amount){
        return res.status(400).json({
            message:`Insufficient balance, current balance is ${balance}`
        })
    }

    // Create transaction { Pending }

    const session=await mongoose.startSession();
    session.startTransaction();

    const transaction=new transactionModel({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    });

    const debitLedgerEntry=await ledgerModel.create([{
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"

    }],{session})

    const creditLedgerEntry=await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"

    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session});

    await session.commitTransaction();
    session.endSession();

    await emailService.sendTransactionEmail(
        req.user.email,
        req.user.name,
        amount,
        toAccount
    )
    return res.status(201).json({
        message:"Transaction completed sucessfully",
        transaction:transaction
    })
}

async function createInitialFundsTransaction(req,res){
    const {toAccount,amount,idempotencyKey}=req.body;

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"toAccount, amount or idempotency key is missing"
        })
    }
    const toUserAccount=await accountModel.findOne({
        _id:toAccount
    });

    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalide Account"
        })
    }

    const fromUserAccount=await accountModel.findOne({
        
        user:req.user._id
    });
    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user not found"
        })
    }

    const session=await mongoose.startSession();
    session.startTransaction();

    const transaction= (await transactionModel.create([{
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session}))[0]

    const debitLedgerEntry=await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT",
    }],{session})

    const creditLedgerEntry=await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT",
    }],{session})

    // transaction.status="COMPLETED"
    // await transaction.save({session})
    await transactionModel.findOneAndUpdate(
        {_id:transaction._id},
        {status:"COMPLETED"},
        {session}
    )

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
        message:"Initial funds transacion completed successfully",
        transaction:transaction
    })
}

module.exports={ createTransaction,createInitialFundsTransaction }