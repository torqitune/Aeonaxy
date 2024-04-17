import React,{useState} from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const {userId} = useParams();           //geting unique userID from the url passed after registering the user
    const [image,setImage] = useState(null);        //creating a useState hook , this image variable will store the url of the image , now it is initialized to null
    const [location , setLocation] = useState(null);
    const navigateTo = useNavigate();           //creating an instance



    const handleLocationChange = (e) => {        //when input of location is changed , update the values of the state variable
        setLocation(e.target.value);
    }

    // console.log("profile pages url : " , userId);

    const handleSubmit = async (e) =>{
        e.preventDefault(); //this is used to prevent default behavior of an event from occurring, When an event is triggered (e.g., form submission, link click, button click), the browser executes a default action associated with that event. For example, when a form is submitted, the browser typically sends a request to the server and reloads the page.
        // In some cases, we  want to prevent this default behavior from happening , we want to validate form data with JavaScript before submitting the form to the server. so prevent it before submitting to server.   
    
        const imageUrl = image;
        try{
            const response = await axios.post("https://aeonaxy-6-jzkv.onrender.com/profile",{userId , imageUrl , location});         //sending userId (mongoDB) and image (image url of local image) and the location in post request
            console.log("profile page, userId and image Url",response.data);
            navigateTo(`/Survey/${userId}`);                    //redirecting to survey page , while passing uderID (mongoDB unique id).
        }catch(err){
            console.log("ProfilPage error while sending post request",err);
        }
    };

    //when choose image button is clicked 
    const handleChooseImageClick = () => {
        document.getElementById('imageUpload').click();         //triggering file input click event
    }


    //when user uploads and image
    const handleImageUpload = (e) => {      //passing an event
        const file = e.target.files[0];     //the input field(image) can select multiple images and is array-like object , so accesing only 1st image

        const reader = new FileReader();                //creating a new instance of FileReader object . Basically  FileReader object is used to read teh contents of files asynchronously.

        reader.onloadend = () => {      //setting up this event , so when file reading operation is complete this event will be triggered.
            setImage(reader.result);        //calling the setter function , to set the image url , reader.result congtains the image url 
        };

        if (file) {             //checking if the file is selected , i.e a user has selected a file
            reader.readAsDataURL(file);     //readAsDataURL is the method of FileReader object , so calling this method with the selected file as its arguement , this method will start reading operation and when operation is complete , the onloaded event is triggered.
        }
    }

    return(
        <div>
            <nav className="p-7">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center">
                        <img src="/dribbble1.jpg" alt="Logo" className="h-12 w-20 ml-6" />         
                    </div>
                </div>
            </nav>

            <div className="container mx-auto mt-5 flex justify-center">
                <form className="w-full max-w-md" onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold mb-6">Welcome! Let's create your profile</h1>
                    <p className="text-sm  mb-6 ">Let others get to know you better! You can do these later</p>
                    <p className="text-sm font-bold mb-6 ">Add an Avatar</p>

                    {/* upload image */}
                    <div className="flex items-center mb-6">
                        <div className="h-24 w-24 border-dashed border-2 rounded-full flex items-center justify-center mr-4">
                            {image ? (
                                <img src={image} alt="Avatar" className="h-full w-full rounded-full" />
                            ) : (
                                <span className="text-gray-400">📷</span>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" />
                        <button type="button" onClick={handleChooseImageClick} className="border border-black-500 text-black   font-bold py-2 px-4 rounded cursor-pointer">
                            Choose Image
                        </button>
                    </div>

                    {/* add your location  */}
                    <p className="text-sm font-bold mb-3 ">Add your location</p>
                    <input type='text' value={location} onChange={handleLocationChange} className='focus:outline-none w-full'></input>
                    <hr className='mb-2'></hr>

                    <button type="submit" className="bg-pink-600 text-white font-bold py-2 px-4 rounded">
                        Save Profile
                    </button>

                </form>
            </div>
        </div>
    );
}

export default ProfilePage

