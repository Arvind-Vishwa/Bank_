const mongoose=require('mongoose');
const bcrypt=require('bcrypt')

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required for creating a user"],
        trim:true,
        lowercase:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Invalid Email Address"
        ],
        unique:[true,"Email already exist"]
    },
    name:{
        type:String,
        required:[true,"Name is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password length should be 6 or more"],
        select:false
    },
    systemUser:{
        type:Boolean,
        default:false,
        immutable:true,
        select:false
    }
},{
    timestamps:true
})

// before saving the data 
userSchema.pre('save',async function () {
    
    if(!this.isModified("password")){
        return ;
    }
    const hash=await bcrypt.hash(this.password,10);
    this.password=hash;
    return;

})

// comaparing the password saved in database with current one

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

const userModel=mongoose.model("user",userSchema);

module.exports=userModel;