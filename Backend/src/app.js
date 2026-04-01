const express=require('express');
const app=express();
const cookieParser=require('cookie-parser');
const authRouter=require("./routes/auth.routes");
const accountRouter=require("../src/routes/account.routes")
const transactionRoutes=require("./routes/transaction.routes")
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/accounts',accountRouter);
app.use("/api/trasactions",transactionRoutes)

module.exports=app;