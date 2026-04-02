const userModel=require("../models/user.models");
const jwt=require('jsonwebtoken');
const emailService=require("../services/email.services")
const {tokenBlackListModel}=require('../models/blackList.models')

async function userRegisterController(req,res){

    const {email,name,password}=req.body;

    const isUserExist=await userModel.findOne({
        email:email
    })

    if(isUserExist){
        return res.status(422).json({
            message:"User already exist"
        })
    }

    // user ko create krna h
    const user=await userModel.create({
        email,name,password
    });

    // token generate
    const token=jwt.sign({
        userId:user._id
    },process.env.JWT_SECRET,
    {expiresIn:"3d"}
    )

    res.cookie("token",token);

    res.status(201).json({
        message:"User created successfully",
        _id:user.id,
        name:user.name,
        email:user.email,
        password:user.password,
        token
    },
    await emailService.sendRegistrationEmail(user.email,user.password)
    
)
}

async function userLoginController(req,res){

    const {email,password}=req.body;

    const user=await userModel.findOne({email}).select("+password");
    console.log(password);
    if(!user){
        return res.status(401).json({
            message:"User email or password invalid"
        })
    }

    const isPasswordValid= await user.comparePassword(password);

    if(!isPasswordValid){
        return res.status(401).json({
            message:"Email or Password is Invalid"
        })
    }
    const token=jwt.sign({
        userId:user._id
    },
    process.env.JWT_SECRET,
    {expiresIn:"3d"}
    )

    res.cookie("token",token);

    return res.status(200).json({
        message:"Login success"
    })

}

async function logoutController(req,res){
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(200).json({
            message:"User logout successfully"
        })
    }
   

    await tokenBlackListModel.create({
        token:token
    });

    res.clearCookie("token");

    res.status(200).json({
        message:"User logout successfully"
    })

}

module.exports={userRegisterController,userLoginController,logoutController};