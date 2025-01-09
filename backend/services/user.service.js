import userModel from '../models/user.model.js' 

export const createUser=async({
    email,password
}) =>{
    if(!email || !password)
    {
        throw new Error('email and password are required');
    }
    
   
    const hashPassword= await userModel.hashPassword(password)
    const user= await userModel.create({
        email,
       password: hashPassword
    })
    await user.save();
    console.log(user)
    return user;
}
export const getAllUser=async({userId})=>{
    const allUser= await userModel.find(
        { _id:{$ne:userId}

        }
    )
    return allUser
}
