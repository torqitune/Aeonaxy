import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';


const EmailPage = () => {
    const { userId } = useParams();         //fetching the userID from the url parameter
    const [email, setEmail] = useState('');     //creating useState hook to store email in a state variable

    useEffect(() => {
        axios.post('http://localhost:8080/email', { userId })       //making a post request again , sending userID , so in response we get the emailID of the user linekd with userID
            .then(response => {
                setEmail(response.data.email);              //setting the value of the mail
            })
            .catch(error => {
                console.error('Error fetching email:', error);
            });
    }, []); //passing an empty dependecy here , means the effect should run only once , when the component mounts.
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
                <div className='w-full max-w-md'>
                    <h1 className="text-2xl text-center font-bold mb-6">Please verify your email...</h1>
                    <img src='/emailIcon.png' className='mx-auto block'></img>
                    <p className="text-sm text-center text-gray-600  mb-6 ">Please verify your email address. We've sent a confirmation email to:</p>
                    <p className="text-md font-bold text-center  mb-6 ">{email}</p>
                    <p className="text-sm text-center text-gray-600  mb-6 ">Click the confirmation link in that email to begin using Dribbble.</p>
                    <p className="text-sm text-center text-gray-600  mb-6 ">Didn't receive the email? Check your Spam folder, it may have been caught by a filter. If
you still don't see it, you can<a className='text-pink-500 text-gray-600 font-bold'> resend the confirmation email.</a> </p>
                    <p className="text-sm text-center text-gray-600  mb-6 ">Wrong email address? <a className='text-pink-500 font-bold'> Change it.</a> </p>

                </div>
            </div>

        


        </div>
    );
}

export default EmailPage