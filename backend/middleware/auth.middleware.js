import jwt from 'jsonwebtoken'
import redisClient from '../services/redis.service.js'
export const authUser=async (req,res,next)=>{
    try{
         const token= req.headers.authorization.split(' ')[1]
         if(!token)
         {
            return res.status(401).send({error:'Unauthorized user'})
         }
         const isBlacklisted= await redisClient.get(token)
         if(isBlacklisted)
         {
             return res.status(401).send({error:'Unauthoriz User'})
         }
         const decoded=jwt.verify(token,process.env.JWT_SECRET)
         req.user=decoded
         next()
    }
    catch(e)
    {
        res.status(401).send({error:'Unauthorized user'})
    }

}

export default authUser