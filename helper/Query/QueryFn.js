import asyncHandler from 'express-async-handler';
import db from '../../config/db.js';

const createUser = asyncHandler(async (firstName, lastName, email,phoneNo,username,passwordHash,statusInfo,usertype,currentDateTime) => {
    return await db.query(
    "INSERT INTO userdetails (first_name, last_name, email,phone_no,username, password,status,user_type,created_date) VALUES (?,?,?,?,?,?,?,?,?)",
    [firstName, lastName, email, phoneNo,username,passwordHash,statusInfo,usertype,currentDateTime]
  );
});

//userdetails

const userRegDetails = asyncHandler(async (id) => {
  return await db.query(
  "SELECT id,first_name, last_name, email,phone_no,username,status,created_date FROM userdetails WHERE id=? ",
  [id]
);
});




// const loginedUser = asyncHandler(async (id) => {
//   return await db.query(
//   "SELECT name,email,phone_no FROM userdetails WHERE id=? ",
//   [id]
// );
// });

//loginDeatails
const loginDetails = asyncHandler(async (username) => {
  return await db.query(
  "SELECT first_name, last_name, email,phone_no,username,status FROM userdetails WHERE email=? ",
  [username]
);
});


//username checks in db

 const verifyUsername = asyncHandler(async (username) => {
    return await db.query(
      `SELECT id,first_name,last_name,email,phone_no,username,password,status FROM userdetails  WHERE username=?`,
      [username]
    );
  
  });

//forgot password step1
const verifyUserCredential = asyncHandler(async (username,email) => {
  return await db.query(
    `SELECT id,first_name,last_name,email,phone_no,username,password,status FROM userdetails  WHERE username=? and email=?`,
    [username,email]
  );

});
const updateUserPassword = asyncHandler(async (password,username) => {
 
  return await db.query(
    `UPDATE userdetails SET password=? WHERE username=?`,[password,username,]
  );
});
const getUpdateUserPassword = asyncHandler(async (username) => {

  return await db.query(
    `SELECT id,first_name,last_name,email,phone_no,username,password,status FROM userdetails  WHERE username=?`,[username]
  );
});


  const getAlldata = asyncHandler(async () => {
    return await db.query(
      `SELECT * FROM userdetails `
  
    );
  
  });

export {
  createUser,userRegDetails,loginDetails,verifyUsername,getAlldata,verifyUserCredential,updateUserPassword,getUpdateUserPassword
  };
  