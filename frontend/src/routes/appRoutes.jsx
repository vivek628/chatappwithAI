import React from "react";
import {Route,BrowserRouter,Routes} from 'react-router-dom'
import Login from "../screens/login.jsx";
import Register from "../screens/register.jsx";
import Home from "../screens/home.jsx";
import Project from '../screens/project.jsx'
import UserAuth from "../auth/UserAuth.jsx";

import UserChatBox from "../screens/userchatbox.jsx";
const appRoutes=()=>{
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserAuth><Home/></UserAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register></Register>} />
            <Route path="/project" element={<UserAuth><Project></Project></UserAuth>} />
            <Route path="/userchat" element={<UserAuth><UserChatBox/></UserAuth>} />

          </Routes>
        </BrowserRouter>
      )
}
export default appRoutes