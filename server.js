const { Pool } = require("pg"); //importing pool class from pg module, let say pg module is a popular library for working with PostgreSQL databases in Node.js.
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { Db } = require("mongodb");
require("dotenv").config();
// Require the cloudinary library
const cloudinary = require("cloudinary").v2;
const {Resend} = require('resend');
require('dotenv').config();
// const resend = new Resend('re_SEApJDa3_NmkTdBBKsuxaBJcJFMCbU1BK');
const resend = new Resend(process.env.RESEND_API_KEY);


// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
});



const app = express(); //creating an instance of express application , now app object represent express app , that will be used to define routes etc.
app.use(
  cors({
    //The CORS (Cross-Origin Resource Sharing) middleware in Express is used to enable cross-origin requests from a browser
    origin: "http://localhost:5173", //only this origin (domain) is allowed to access the resources of this server
    credentials: true,
  })
);

const port = process.env.PORT || 8080;
app.use(bodyParser.json()); //this will help use parse the json from the incoming http request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

//conecting to our mongoose DB
mongoose
  .connect("mongodb+srv://aaryan:abc12345@cluster0.p9zdt9e.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

//creating a schema for a collection inside our DB
const userSchema = new mongoose.Schema({
  firstName: String,
  userName: String,
  email: String,
  password: String,
  imageUrl: String,
  location: String,
  lookingFor: Array,
});

//creating a model for our schema , this will help us to interact
const User = mongoose.model("User", userSchema);


//defining how to handle post request
app.post("/register", async function (req, res) {
  //req, is the requested object and res is the response
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 4);

    //creating a new user
    const newUser = new User({
      firstName: req.body.firstName,
      userName: req.body.username,
      email: req.body.email,
      password: hashPassword, //creating a hash for our password , with 4 salting round , these are 2 parameters here.
      imageUrl: null,                         
      location: null,           //initially these fields will be emplty when user registers
      lookingFor: null,         //coz these values will be updated in the profile page
    });

    
    await newUser.save();           //saving our user in the DB

    const userId = newUser._id;     //accessing the unique id generated by unique_ID

    res.json({ message: "Registered Succesfully", userId: userId });    //sending/returning the userId in the response
  
} catch (err) {                         //if any errors found
    console.log("Unable to save our user, error:", err);
    res.status(500).json({ error: "Unable to save user" });
  }
  
});

//handling post request for profile
app.post("/profile", async function (req, res) {
  try {
    //extracting userId ,location and imageUrl from the request body
    const { userId, imageUrl, location } = req.body;


    let imageUrlVariable;           //creating a global variable which will store the resutl generated by the cloudinary
    const imageGenerate = await cloudinary.uploader.upload(imageUrl).then((result) => {
        imageUrlVariable = result.url;      //setting our global variable with the value of the url generated
    })
    .catch((err) => {
        console.log("error uploadin image and updating user", err);
    });

    
    
    //updating our user with userID with the values of imageUrl and location
    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { imageUrl: imageUrlVariable, location: location },
      { new: true }
    );


    if (!updateUser) {
      return res.json({ message: "user can't be updated! NOT FOUND" });
    }

    res.json({ success: true });
  } catch (err) {
    console.log("Error in post reqeust of profile (server.js) : ", err);
  }
});


//handling post request for emailPage
app.post("/email", async function(req,res){
  try{
    const {userId,selectedCards} = req.body;    //extracting userId and selectedCards array from the request body
  
  //updating our user with userID with the values of selectedCards in the lookingfor field
  const updateUser = await User.findOneAndUpdate(
    { _id: userId },
    { lookingFor: selectedCards},
    { new: true }
  );


  //finding the user with userID
  const tempUser = await User.findById(userId);
  const emailFound = tempUser.email;      //fethcing the email from the found user.

  console.log(emailFound);
  //using the resend API documentation code , to send the thank you message
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: emailFound,
    subject: 'THANK YOU',
    html: '<p><strong>For using DRIBBLE :)</strong></p>'
  });

  console.log("Email send");



  if (!updateUser) {                        //if update was unsuccessfull then return a message
    return res.json({ message: "user can't be updated! NOT FOUND" });
  }


  console.log("selectedCardUpdate DONE");
  res.json({ success: true , email : emailFound});    //else return a success.
  
  }catch(err){
    console.log("Error in post reqeust of profile (server.js) : ", err);
  }



});



//listening our requests
app.listen(port, () => {
  console.log("Server running on port 3001");
});

