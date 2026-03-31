const mongoose=require("mongoose");


const transactionSchema=new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a from Account"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must be associated with a to Account"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED"],
            message:"status can be pending,completed,failed or reversed"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for creating a transaction"],
        min:[0,"Transaction amount cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency key is required to creating a transaction"],
        index:true,
        unique:true
    }
},{
    timestamps:true
});


const transactionModel=mongoose.model("transaction",transactionSchema);

module.exports={ transactionModel };