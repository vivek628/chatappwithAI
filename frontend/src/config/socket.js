import socket from 'socket.io-client';

let socketInstance = null;

// Initialize the socket connection
export const initializeSocket = (projectId) => {
    // Create a socket instance and connect to the server
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token'),  // Get the token from localStorage
        },
        query: {
            projectId,  
        },
    });

   
    socketInstance.on('connect', () => {
        console.log('Socket connectesd:', socketInstance.id);
    });

   
    socketInstance.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
    });

  
    socketInstance.on('connect_timeout', () => {
        console.error('Socket connection timeout');
    });

    return socketInstance;
};

// Listen for incoming messages or events
export const receiveMessage = (eventName, cb) => {
    
    if (socketInstance) {
        socketInstance.on(eventName, cb);
    } else {
        console.error('Socket not initialized!');
    }
};

// Send a message or event to the server
export const sendMessage = (data) => {
    console.log("Sending message:", data);
    if (socketInstance) {
       
        socketInstance.emit('project-message', { 
            sender: data.sender, 
            receiver: data.receiver,
            text: data.text,
            timestamp: data.timestamp
        });
    } else {
        console.error('Socket not initialized!');
    }
};

