import React, { useContext, useState, useEffect } from "react";
import { UserContext } from '../context/user.context';
import axios from '../config/axios.js';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [isUserModalOpen, setUserModalOpen] = useState(false); 
  const [allUsers, setAllUsers] = useState([]); 
  useEffect(() => {
    axios.get('/all')
      .then((res) => {
        setProjects(res.data.projects);
      })
      .catch((e) => {
        console.log(e);
      });
      axios.get('/allUser')
      .then((res) => {
        setAllUsers(res.data.users);
      })
      .catch((e) => {
        console.log(e);
      });
      
   
   
  }, []);
  console.log(allUsers)
  const createProject = (e) => {
    e.preventDefault();

    if (projectName) {
      axios.post('/create', { name: projectName })
        .then((res) => {
          setModalOpen(false);
          window.location.reload()
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 409) {
              setProjectName(" ");
              alert("Project name already exists. Please choose a different name.");
            } else {
              console.error(err);
              alert("An error occurred. Please try again.");
            }
          } else {
            alert("Network error. Please check your connection.");
          }
        });
    } else {
      alert("Please enter a project name");
    }
  };

  return (
    <main className="p-4">
      <div className="project flex space-x-4"> 
        <button
          className="project p-4 border border-slate-300 rounded-md"
          onClick={() => setModalOpen(true)}
        >
          <i className="ri-link"></i> Create Project
        </button>
        <button
          className="project p-4 border border-slate-300 rounded-md"
          onClick={() => setUserModalOpen(true)} 
        >
          <i className="ri-user-line"></i> ALL USER
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Enter Project Name</h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full mb-4"
              placeholder="Project Name"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-red-500 text-white p-2 rounded-md"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={createProject}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
           
            {allUsers.length > 0 ? (
            allUsers.map((user) => (
              <div key={user._id} className="bg-gray-200 p-6 rounded-lg shadow-lg" onClick={() => {
                navigate(`/userchat`, { state: { user } });
              }}>
                <h3 className="text-xl font-semibold mb-2">{user.email}</h3>
                <div className="flex items-center space-x-2">
                </div>
              </div>
            ))
          ) : (
            <p>No projects available</p>
          )}
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 text-white p-2 rounded-md"
                onClick={() => setUserModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="bg-gray-200 p-6 rounded-lg shadow-lg" onClick={() => {
                navigate(`/project`, { state: { project } });
              }}>
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <div className="flex items-center space-x-2">
                  <i className="ri-group-line"></i>
                  <span className="text-gray-600">{project.users.length} users</span>
                </div>
              </div>
            ))
          ) : (
            <p>No projects available</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
