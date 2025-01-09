import projectModel from '../models/project.model.js'
import  * as projectService from '../services/project.service.js'
import userModel from '../models/user.model.js'
export const createProjet=async(req,res)=>{
    try{
        const {name}=req.body;
        const loggedInUser=await userModel.findOne({email:req.user.email})
        const userId=loggedInUser._id
        const newProject=await projectService.createProject({name,userId})
        res.status(201).json(newProject)
    }
    catch(e)
    {  
        if (e.status === 409) {
            return res.status(409).json({
                error: 'Conflict',
                message: e.message,
            });
        }
        res.status(400).json({
            error: 'Bad Request',
            message: e.message,
        });
    }
   
 }
 export const getAllProject=async(req,res)=>{
     try{
        const loggedInUser=await userModel.findOne({email:req.user.email})
        const allUserProject=await projectService.getAllProjectByUserId({userId:loggedInUser})
        return res.status(200).json({projects:allUserProject})
       

         
     }
     catch(err){
        console.log(err)
        res.status(404).json({error:err.message})
     }
 }
 export const addUserToProject=async(req,res)=>{
    try{

        const {projectId,users}=req.body
        const loggedInUser=await userModel.findOne({email:req.user.email})
        const project=await projectService.addUsersToProject({projectId,users,userId:loggedInUser._id})
        return res.status(200).json({project})

    }
    catch(e)
    {
        console.log(e)
        res.status(400).json({error:e.message})
    }
 }
 export const getProjectById=async (req,res)=>{
    const {projectId}=req.params
    try{
        const project=await projectService.getProjectById({projectId})
        
        return res.status(200).json({project})

    }
    catch(e){
        res.status(400).json({error:e.message})
    }
 }
 export const getGroupMember=async(req,res)=>{
    console.log("aaya",req.params)
    const {projectId}=req.params
    try{
        const members=await projectService.getGroupMember({projectId})
        console.log(members)
      
        return res.status(200).json({members})
    }
    catch(e){
        console.log(e)
    }
 }