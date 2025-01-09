import mongoose from "mongoose";
function connect()
{
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        try{
            console.log("connection is done")
        }
        catch(e)
        {
            console.log("somthing went wrong in connection with mongoose",e)
        }
    })
}
 export default connect
  