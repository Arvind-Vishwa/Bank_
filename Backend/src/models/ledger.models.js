const mongoose=require("mongoose");
const { type } = require("os");


const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Ledger must be associated with account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Ledger must be associated with amount"],
        immutable:true,
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Ledger must be associated with transaction"],
        immutable:true,
        index:true
    },
    type:{
        type:String,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"type can be either credit or debit"
        },
        required:[true,"Ledger type is required"],
        immutable:true
    }
})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre("findOneAndReplace",preventLedgerModification);

const ledgerModel=mongoose.model('ledger',ledgerSchema);

module.exports= ledgerModel;