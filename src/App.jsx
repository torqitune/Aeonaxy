import ProfilePage from "./components/ProfilePage";
import RegistrationPage from "./components/RegistrationPage";
import Survey from "./components/Survey";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import EmailPage from "./components/EmailPage";


function App() {
  return(

    <Router>
      <Routes>
        {/* using exact we ensuring that on path with "/" matcht an reg. page should be rendered, without exact keyword both "/" and "/Profile" would match as both start with "/" so both page will be rendered */}
        <Route path="/" element={<RegistrationPage/>} />       
        <Route path="/profile/:userId"  element={<ProfilePage/>} />   
        <Route path="/survey/:userId" element={<Survey/>} /> 
        <Route path="/email/:userId" element={<EmailPage/>}/>
      </Routes>
    </Router>
  );
}

export default App
