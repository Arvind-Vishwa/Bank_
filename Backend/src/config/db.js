require('dotenv').config();
const mongoose=require('mongoose');

async function connectDB(){
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("database is connected");
    }).catch((err)=>{
        console.log("err connecting to database");
        process.exit(1);
    })
    
}

module.exports=connectDB;