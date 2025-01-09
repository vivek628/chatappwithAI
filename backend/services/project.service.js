import projectModel from '../models/project.model.js'
export const createProject=async({
    name,userId
})=>{
    if(!name)
    {
        throw new Error('User name is required')
    }
    if(!userId)
    {
        throw new Error('User name is required')
    }
    try{
        const project= await projectModel.create({
            name,
            users:[userId]
        })
        return project
    }
    catch(err){
        if(err.code===11000)
        {
            const error = new Error('Project name already exists. Please choose a different name.');
            error.status = 409; // Set status to 409 (Conflict)
            throw error;
        }
        throw err
    }
   
  
}
 export const  getAllProjectByUserId=async({userId})=>{
    if(!userId){
        throw new Error('userId is required')
    }
    const allUserProject=await projectModel.find({
        users:userId
    })
    return allUserProject
}
export const addUsersToProject = async ({ projectId, users,userId }) => {
    if (!projectId) {
        throw new Error("projectId is required");
    }
    if (!users) {
        throw new Error("Users are required");
    }

    const project = await projectModel.findOne({ _id: projectId, users: { $in: [userId] } });
    if (!project) {
        throw new Error('User does not belong to this Project');
    }

    const updatedProject = await projectModel.findOneAndUpdate(
        { _id: projectId },
        {
            $addToSet: {
                users: { $each: users }
            }
        },
        { new: true }
    );

    return updatedProject;
};
export const getProjectById=async({projectId})=>{
    if(!projectId)
    {
        throw new Error("project id is required")
    }
    const project=await projectModel.findOne({
        _id:projectId
    }).populate('users')
    return project
}
export const getGroupMember=async({projectId})=>{
    if(!projectId)
        {
            throw new Error("project id is required")
        }
        const project = await projectModel.findById(projectId)
        .populate('users', 'email');
        return project
}