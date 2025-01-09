import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import projectModel from './models/project.model.js';
import {genrateResult} from './services/ai.service.js'
const port = process.env.PORT || 5000; 
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});


io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;  
        if (!token) {
            return next(new Error('Token not available'));
        }
        if(projectId)
        {
            socket.project = await projectModel.findById(projectId);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(new Error('Invalid token'));
        }
        socket.user = decoded;
        if(projectId)
        {
            socket.roomId=projectId
        }
        next(); 
    } catch (err) {
        next(err); 
    }
});

io.on('connection', (socket) => {
    socket.join(socket.roomId);
    socket.on('project-message', async (data) => {
        socket.broadcast.to(socket.roomId).emit('project-message', data);
        const msg=data.text
        const aiPresentInmsg=msg.includes('@ai')
        if(aiPresentInmsg)

        {
            const prompt=msg.replace('@ai',"")
            const result= await genrateResult(prompt)
            io.to(socket.roomId).emit('project-message',{
                text:result,
                sender:"AI"
            })
            return 
        }
    });
    socket.on('direct-message', (data) => {
        const { recipientSocketId, text } = data;
        io.to(recipientSocketId).emit('direct-message', data);
    });

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
        socket.leave(socket.roomId)
    });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
