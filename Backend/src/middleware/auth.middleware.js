const userModel=require("../models/user.models")
const jwt=require("jsonwebtoken");
const tokenBlackListModel=require("../models/blackList.models")

async function authMiddleware(req,res,next){

    const token=req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized user or token missing"
        })
    }
    const isBlackListed=await tokenBlackListModel.findOne({token});

    if(isBlackListed){
        return res.status(401).json({
            message:"Unauthorize, token is invalid"
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

async function authSystemUserMiddleware(req,res,next){

    const token=req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access, token is missing"
        })
    }

    const isBlackListed=await tokenBlackListModel.findOne({token});

    if(isBlackListed){
        return res.status(401).json({
            message:"Unauthorize, token is invalid"
        })
    }

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        const user=await userModel.findById(decoded.userId).select("+systemUser");

        if(!user.systemUser){
            return res.status(403).json({
                message:"forbidden access,not a system user"
            })
        }

        req.user=user;
        return next();
    }catch(err){
        res.status(401).json({
            message:"Unauthorised access"
        })
    }


}

module.exports={ authMiddleware ,
    authSystemUserMiddleware
}