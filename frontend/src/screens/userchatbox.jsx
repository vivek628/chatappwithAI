import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { UserContext } from '../context/user.context.jsx';
import { initializeSocket, receiveMessage } from '../config/socket.js';

const UserChatBox = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const receiver = location.state?.user;
  if (!receiver) {
    return <div>Loading or error: </div>;
  }

  useEffect(() => {
    const receiverId = receiver._id;
    const socketInstance = initializeSocket(null, receiverId);
    const messageHandler = (data) => {
      if (data.sender !== user.email) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    };
    receiveMessage('direct-message', messageHandler);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [receiver._id, user.email]);

  const handleSendMessage = () => {
    if (!user || !input.trim()) return;

    const newMessage = {
      sender: user.email,
      receiverSocketId: receiver.socketId, 
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    sendDirectMessage(newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput(''); 
  };
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  return (
    <div className="flex w-full h-screen bg-gray-100 justify-center relative">
      <div className="w-[600px] bg-white text-black p-4 flex flex-col h-full rounded-lg shadow-lg relative z-10">
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-t-lg border-b">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
            {receiver.email}
          </button>
        </div>
        <div className="flex flex-col flex-grow space-y-4 overflow-y-auto mb-4 max-h-full">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === user.email ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-lg max-w-xs 
                  ${msg.sender === 'AI' ? 'bg-black text-white' : msg.sender === user.email ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}
              >
                <p className="text-sm break-words">{msg.text}</p>
                <span className="text-xs text-gray-300">{msg.timestamp}</span>
              </div>
              <div className="text-xs text-gray-800 mt-1">{msg.sender === user.email ? 'you' : msg.sender}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center p-4 bg-white border-t mt-auto">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none"
          />
          <button onClick={handleSendMessage} className="ml-2 p-2 bg-indigo-600 text-white">
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChatBox;
