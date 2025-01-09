import React,{useState} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from '../config/axios'

const Register = () => {
    const navigate=useNavigate()
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState(' ')
    function submitHandler(e)
    {
        e.preventDefault()
        axios.post('/register',{
            email,
            password
        }).then((res)=>{
            console.log(res)
            navigate('/')
        }).catch(e=>{
            console.error
        })
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg w-96 shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">Create an Account</h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              id="email"
              className="w-full p-3 mt-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              onChange={(e)=>setPassword(e.target.value)}
              type="password"
              id="password"
              className="w-full p-3 mt-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <span className="text-blue-400 cursor-pointer">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
