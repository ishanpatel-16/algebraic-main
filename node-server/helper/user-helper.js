import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import {
  createUser,
  userRegDetails,
  verifyUsername,
  getAlldata,
  updateUserPassword,
  verifyUserCredential
} from './Query/QueryFn.js';

//json-webTocken

const generateJwtTocken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETKEY, { expiresIn: "30d" });
};

//Login
const doLogin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  let verifyUserData, VerifypassWord, userData;
  if (
    username != "" ||
    (username.length > 0 && password != "") ||
    password.length > 0
  ) {
    verifyUserData = await verifyUsername(username);
  
    if (verifyUserData.length > 0) {
   
      userData = verifyUserData[0];
      const userPassword = userData.password;
      VerifypassWord = await bcrypt.compare(password, userPassword);
      if (!VerifypassWord) {
        res.json({ error:"Invalid Username or Password "});
      } else {
        res.json({data: userData });
      }
    } else {
      res.json({ error:"Invalid Username or Password "});
    }
  } else {
    res.json({ error:"Invalid Username or Password "});
  }
});

//forgot-password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email,username,password } = req.body;
 
  if (
    username != "" &&
    (username.length > 0 && email != "") &&
    password.length > 0
  ) {
    if (password.length <= 4) {
      return res.json({ error: "Password must be at least 4 letters" });
    }
    
    let verifyUserData = await verifyUserCredential(username,email);
   
    if (verifyUserData.length > 0) {
      
      const passwordHash = await bcrypt.hash(password, 10);
      
      const updatePassword = await updateUserPassword(passwordHash,username);
      if(updatePassword){
        res.json({ data:"Password changed successfully!"});
      }
    } else {
      res.json({ error:"Invalid Username or email "});
    }
  } else {
    res.json({ error:"please fill the required fields"});
  }
});

const getData = asyncHandler(async (req, res) => {

  const dataResult = await getAlldata();
  if (dataResult.length > 0) {
    return res.status(200).json({ data: dataResult });
  }else{
    return res.status(400).json({ error: "Failed " });  
  }
});
//Registration

const doSignUp = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phoneNo, username, password } = req.body;
  const statusInfo = 1;
  const usertype =1
  
  const existingUsername = await verifyUsername(username);
  if (existingUsername.length > 0) {
   
    return res.json({ error: "Username is already registered" });
  }

  else if (username.length <= 2) {
    return res.json({ error: "Username must be at least 3 letters" });
  }

  else if (password.length <= 4) {
    return res.json({ error: "Password must be at least 4 letters" });
  }
  
  const currentDateTime = new Date();
  const passwordHash = await bcrypt.hash(password, 10);
  
  const userDetails = await createUser(firstName, lastName, email, phoneNo, username, passwordHash, statusInfo,usertype, currentDateTime);
  if (!userDetails) {
    return res.json({ error: "Failed to create user" });
  }
  
  const regData = await userRegDetails(userDetails.insertId);
  if (regData.length === 0) {
    return res.json({ error: "Failed to retrieve user details" });
  }
  
  return res.json({ data: regData });
});





export {
  doLogin,
  doSignUp,
  forgotPassword,getData,

};
