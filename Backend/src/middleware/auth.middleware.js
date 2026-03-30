const userModel=require("../models/user.models")
const jwt=require("jsonwebtoken");


async function authMiddleware(req,res,next){

    const token=req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized user or token missing"
        })
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded.userId);

        req.user=user;
        return next();
    }catch(err){
        res.status(401).json({
            message:"Unauthorized User,token is invalid"
        })
    }
}

module.exports={ authMiddleware }