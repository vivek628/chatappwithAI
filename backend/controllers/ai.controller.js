
import * as ai from '../services/ai.service.js'
 export const getResult=async (req,res)=>{
    try{
        const {promt}=req.query
        const result=await ai.genrateResult(promt)
        res.send(result)
    } 
    catch(err)
    {
        res.status(500).send({message:err.message})
    }
 }