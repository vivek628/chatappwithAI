import userModel from '../models/user.model.js';
import * as userServices from '../services/user.service.js';
import redisClient from '../services/redis.service.js';

export const createUserController = async (req, res) => {
  
  try {
    const user = await userServices.createUser(req.body);
    const token = await user.generateJwt();  
    delete user._doc.password
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }
};
 export const loginController= async(req,res)=>{
    try{
        const {email,password}=req.body
         const user=await userModel.findOne({email}).select('+password')
         if(!user)
         {
          return  res.status(401).json({
                errors:'Invalid credentials'
            })
         }
         const isMatch=await user.isValidPassword(password)
         if(!isMatch)
         {
            return  res.status(401).json({
                errors:'Invalid credentials'
            })
         }
         const token=await user.generateJwt()
         delete user._doc.password
         res.status(200).json({user,token})

    }
    catch(err){
        res.status(400).send(err.message)
    }
 }

export const profileController=(req,res)=>{
    res.status(200).json({user:req.user})

}
export const logoutController=(req,res)=>{
  try{
    const token= req.headers.authorization.split(' ')[1]
    redisClient.set('token','logout','EX','60*60*24')
    res.status(200).json({message:'logout succesfully'})

  }
  catch(err){
    console.log(err)
    res.status(401).send(e.message)
  }
}
export const getAllUser= async(req,res)=>{
  try{
    const loggedInUser=await userModel.findOne({email:req.user.email})

    const allUsers=await userServices.getAllUser({userId:loggedInUser._id})
    return res.status(200).json({users:allUsers})
      

  }
  catch(e)
  {
    console.log(e)
    res.status(401).json({error:e.message})
  }
}