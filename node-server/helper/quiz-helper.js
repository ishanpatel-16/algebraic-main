import express from 'express';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';
import fs from 'fs';

const app = express();

import formidable from 'formidable';

app.use(bodyParser.json());
import * as util from '../utils/util.js';

import { CreateQuiz, fetchCreatedQuiz, fetchAllQuiz } from './Query/quiz-QueryFn.js';


const createQuiz = asyncHandler(async (req, res) => {
  let form =new formidable.IncomingForm();
  let quiz_img1 = null
  let quiz_img2 = null
  let quiz_img3 = null

form.parse(req,async function (err,fields,files) {
  if(err){
    res.send({status:500,response:[]})
    return;
  }
  if (files.question_img1) {

    quiz_img1 = util.saveImage(
      './media/quizimages/', //Static folder path
        files.question_img1.originalFilename.replace(/\s/g, ""),
        fs.readFileSync(files.question_img1._writeStream.path)
    )
}
if (files.question_img2) {
  
  quiz_img2 = util.saveImage(
    './media/quizimages/',
    files.question_img2.originalFilename.replace(/\s/g, ""),
        fs.readFileSync(files.question_img2._writeStream.path)
    )
}
if (files.question_img3) {
  quiz_img3 = util.saveImage(
    './media/quizimages/',
        files.question_img3.originalFilename.replace(/\s/g, ""),
        fs.readFileSync(files.question_img3._writeStream.path)
    )
}

    let effectiveFrom = new Date();
    let effectiveTo = '3050-02-24 21:05:19';
    let createdDate = new Date();
    let status =1


  const quizCreated =  await CreateQuiz(
    fields.moduleId,
    fields.questionHeader,
    fields.question,
    fields.description,
    quiz_img1,
    quiz_img2,
    quiz_img3,
    fields.type,
    fields.option1,
    fields.option2,
    fields.option3,
    fields.option4,
    fields.option5,
    fields.objAnswer,
    fields.textLabel1,
    fields.textLabel2,
    fields.textLabel3,
    fields.textAnswer1,
    fields.textAnswer2,
    fields.textAnswer3,
    fields.answerHint,
    status,
    effectiveFrom,
    effectiveTo,
    fields.createdBy,
    createdDate
  );

  if (!quizCreated) {
    return res.json({ error: "Failed to create Quiz" });
  } else {
    const fetchQuizData = await fetchCreatedQuiz(quizCreated.insertId);
    if (fetchQuizData.length === 0) {
      return res.json({ error: "Failed to retrieve Quiz details" });
    }

    return res.json({ data: fetchQuizData });
  } 

})
});
   


  
  //get All read Topics
  
  const getQuizByModuleId = asyncHandler(async (req, res) => {
    const moduleId = req.params.id;
    const QuizData = await fetchAllQuiz(moduleId);
    if (QuizData.length > 0) {
      return res.json({ data: QuizData });
    } else {
      return res.json({ data: []});
    }
  });

  
export {
    createQuiz,
    getQuizByModuleId,
  };


 