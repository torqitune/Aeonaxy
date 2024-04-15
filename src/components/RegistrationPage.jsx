import React,{useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
const RegistrationPage = () => {  
  const navigateTo = useNavigate();   //creating instance of usNavigate

  //using useState hook to create a state variable 
  const [formData , setFormData] = useState({
    firstName : '',
    username : '',
    email : '',
    password : '',
  });


  //creating a handleChange method , that will be triggered when a input field's value is changed.
  const handleChange = (e) => {           //an event 'e' is passed as an argument , that have all info about event including the target element which here will input field that triggered the event
    setFormData({...formData , [e.target.id] : e.target.value });   //using the spread operator here to use the previous state, also here value is updating in the form of key:value pair.
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); //this is used to prevent default behavior of an event from occurring, When an event is triggered (e.g., form submission, link click, button click), the browser executes a default action associated with that event. For example, when a form is submitted, the browser typically sends a request to the server and reloads the page.
    // In some cases, we  want to prevent this default behavior from happening , we want to validate form data with JavaScript before submitting the form to the server. so prevent it before submitting to server.

    try{

      //post functio is provided by the axios library for making post requests. 
      const res = await axios.post('http://localhost:8080/register',formData);

      console.log("userID send in this",res.data);      //check your console of browser to see this value
      
      
      if(res.data.userId){          //checking if the user created in the DB , and we got a userId of the mongoDB as a response 
        console.log("Regsitered Successfully");
        
        navigateTo(`/profile/${res.data.userId}`);      //sending the userId we got from mongoDb after saving our user to Db , as a parameter to the profilePage

      }

    }
    catch(err){
      console.log("error msg  : ",err);
    }

  };

  return (
    <div className="flex flex-col md:flex-row h-screen">

      {/* Left section for the image */}
      <div className="bg-cover bg-center md:w-2/5 h-full" style={{ backgroundImage: "url('/yellow.jpg')" }}>
        {/* Logo */}
        <img src="/dribbble1.jpg" alt="Logo" className="mx-auto mt-12" />
      </div>

      {/* Right section for the form */}
      <div className="bg-gray-100 flex justify-center items-center md:w-3/5 p-6">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>

        <h1 className="text-2xl font-bold mb-6">Sign up to Dribble</h1> {/* Added heading */}
          
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="firstName">
                First Name
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="firstName" type="text" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="username" type="text" placeholder="Last Name" value={formData.username} onChange={handleChange}/>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                Email Address
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange}/>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange}/>
            </div>
          </div>
          {/* checkbox below */}
          <div className="flex items-center mb-6">
            <input type="checkbox" id="terms" className="form-checkbox h-5 w-5 text-pink-600" />
            <label htmlFor="terms" className="ml-2 text-gray-700">Creating an account means you're okay with our service <a href="#" className="text-pink-600">Service, Privacy Policy</a> and our default <a href="#" className="text-pink-600">Notification Settings.</a></label>
          </div>
          {/* create button */}
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full px-3">
            <button className="bg-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Create Account
            </button>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
