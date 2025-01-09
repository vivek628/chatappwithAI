
import express from 'express'
import morgan from 'morgan'
import connect from './db/db.js'
import userRoutes from './routes/user.routes.js'
import projectRoutes from './routes/project.routes.js'
import aiRoutes from './routes/ai.routes.js'
import cors from 'cors'


connect()
const app= express()
app.use(cors())

app.use(morgan())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(userRoutes)
app.use(projectRoutes)
app.use(aiRoutes)
app.get('/',(req,res)=>{
    res.send('hellow')
})
export default app
