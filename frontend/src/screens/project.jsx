import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../config/axios.js';
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket.js';
import { UserContext } from '../context/user.context.jsx';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Project = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [input, setInput] = useState('');
  const [isGroupVisible, setIsGroupVisible] = useState(false);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [notMember, setNotMember] = useState([]);
  const projectId = location.state.project._id;
  const getMessagesFromLocalStorage = () => {
    const storedMessages = localStorage.getItem(`projectMessages_${projectId}`);
    return storedMessages ? JSON.parse(storedMessages) : [];
  };
  const [messages, setMessages] = useState(getMessagesFromLocalStorage);
  useEffect(() => {
    initializeSocket(projectId);
    const messageHandler = (data) => {
      if (data.sender !== user.email) {
        const updatedMessages = [...messages, data];
        setMessages(updatedMessages);
        localStorage.setItem(`projectMessages_${projectId}`, JSON.stringify(updatedMessages));
      }
    };
    receiveMessage('project-message', messageHandler);   
    return () => {
      console.log('Cleanup: Removing message listener');
    };
  }, [projectId, user.email, messages]);
  const fetchProjectMembers = async () => {
    try {
      const res = await axios.get(`/getGroupmember/${projectId}`);
      setUsers(res.data.members.users);
    } catch (error) {
      console.error('Error fetching project members:', error);
    }
  };
  const fetchUsersForCollaboratorModal = async () => {
    try {
      const res = await axios.get(`/getGroupmember/${projectId}`);
      const allUsersRes = await axios.get('/allUser');
      const allUsers = [...allUsersRes.data.users, user];  
      const oldMembers = res.data.members.users;  
      const availableUsers = allUsers.filter(
        (user1) => !oldMembers.some((user2) => user2.email === user1.email)
      );
      setNotMember(availableUsers); 
      setIsCollaboratorModalOpen(true);
    } catch (error) {
      console.error('Error fetching users for collaborator modal:', error);
    }
  };
  const handleGroupIconClick = () => {
    setIsGroupVisible((prevState) => !prevState);
  };
  const handleSendMessage = () => {
    if (!user || !input.trim()) return;
    const newMessage = {
      sender: user.email,
      receiver: projectId, 
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`projectMessages_${projectId}`, JSON.stringify(updatedMessages));
    setInput(''); 
    sendMessage(newMessage); 
  };
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleCollaboratorModalClose = () => {
    setIsCollaboratorModalOpen(false);
  };
  const handleUserSelection = (user) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(user)
        ? prevSelectedUsers.filter((u) => u !== user)
        : [...prevSelectedUsers, user]
    );
  };
  const handleAddCollaborators = async () => {
    try {
      const res = await axios.put('/add-user', {
        users: selectedUsers,
        projectId,
      });
      console.log('Collaborators added:', res);
      setSelectedUsers([]);
      setIsCollaboratorModalOpen(false);
      setUsers((prevUsers) => [...prevUsers, ...selectedUsers]);
    } catch (error) {
      console.error('Error adding collaborators:', error);
    }
  };
  useEffect(() => {
    fetchProjectMembers();
  }, [projectId]);

  return (
    <div className="flex w-full h-screen bg-gray-100 justify-center relative">
      <div className="w-[500px] bg-white text-black p-4 flex flex-col h-full rounded-lg shadow-lg relative z-10">
        <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-t-lg border-b">
          <button onClick={fetchUsersForCollaboratorModal} className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Add Collaborator
          </button>
          <i
            className="ri-group-fill text-xl text-gray-600 ml-auto cursor-pointer"
            onClick={handleGroupIconClick}
          ></i>
        </div>

        {/* Conditionally render either chat or group members */}
        {isGroupVisible ? (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white border rounded-md shadow-lg max-h-full overflow-y-auto z-20">
            <div className="flex justify-between items-center p-4">
              <button onClick={handleGroupIconClick} className="text-xl font-semibold text-gray-600">
                <i className="ri-close-large-line"></i>
              </button>
            </div>
            <div className="px-4 py-2">
              {/* Render users in the group */}
              <ul className="space-y-2">
                {users.length > 0 ? (
                  users.map((member, index) => (
                    <li key={index} className="text-sm text-gray-700">{member.email}</li>
                  ))
                ) : (
                  <li>No members available</li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-grow space-y-4 overflow-y-auto mb-4 max-h-full">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === user.email ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-lg max-w-xs 
                    ${msg.sender === 'AI' ? 'bg-black text-white' : msg.sender === user.email ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'}`}
                >
                  {msg.sender === 'AI' && /```([a-z]+)?[\s\S]*?```/g.test(msg.text) ? (
                    <SyntaxHighlighter language="javascript" style={dracula}>
                      {msg.text.replace(/```([a-z]+)?[\s\S]*?```/g, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <p className="text-sm break-words">{msg.text}</p>
                  )}
                  <span className="text-xs text-gray-300">{msg.timestamp}</span>
                </div>
                <div className="text-xs text-gray-800 mt-1">{msg.sender==user.email ? 'you':msg.sender}</div>
              </div>
            ))}
          </div>
        )}

        {/* Message Input Section */}
        {!isGroupVisible && (
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
        )}
      </div>

      <div className="w-[calc(100%-400px)] bg-gray-200 p-4">
        <div className="flex justify-center items-center h-full">
        </div>
      </div>
      {isCollaboratorModalOpen && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-30">
          <div className="bg-white p-6 rounded-md w-[400px] max-h-[80%] overflow-y-auto">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Select Collaborators</span>
              <button onClick={handleCollaboratorModalClose} className="text-xl text-gray-600">
                <i className="ri-close-circle-line"></i>
              </button>
            </div>
            <div className="mt-4">
              <ul className="space-y-2">
                {notMember.length > 0 ? (
                  notMember.map((user, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={user._id}
                        checked={selectedUsers.includes(user)}
                        onChange={() => handleUserSelection(user)}
                      />
                      <label htmlFor={user._id} className="text-sm text-gray-700">
                        {user.email}
                      </label>
                    </li>
                  ))
                ) : (
                  <li>No members available</li>
                )}
              </ul>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={handleAddCollaborators} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                Add Collaborators
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
