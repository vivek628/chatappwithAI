import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
 const userSchema= new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        minlength:[6,"email must be at least 6 charectorlong"]
    },
    password:{
        type:String,
        select:false,
    }
 })
 userSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10)
 }
 userSchema.methods.isValidPassword=async function (password)
 {
     return await bcrypt.compare(password,this.password)
 }
 userSchema.methods.generateJwt=function()
 
 {
    return jwt.sign({email:this.email},process.env.JWT_SECRET,{expiresIn:'24h'})
 }
const User= mongoose.model('user',userSchema)
export default User;