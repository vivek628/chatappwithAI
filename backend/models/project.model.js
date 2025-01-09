import mongoose from 'mongoose'
const projectScehma=new mongoose.Schema({
    name:{
        type:String,
        lowercase:true,
        required:true,
        trim:true,
        unique:true

    },
    users:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'user'
        }

    ]

    
})
const Project= mongoose.model('project',projectScehma)
export default Project