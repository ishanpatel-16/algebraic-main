import asyncHandler from 'express-async-handler';
import db from '../../config/db.js';


    const CreateQuiz = asyncHandler(async (moduleId,questionHeader,question,description,questionImg1,questionImg2,questionImg3,type,option1,option2,option3,option4,option5,objAnswer,textLabel1,textLabel2,textLabel3,textAnswer1,textAnswer2,textAnswer3,answerHint,status,effectiveFrom,effectiveTo,createdBy,createdDate) => {
      return await db.query(
    "INSERT INTO quiz (module_fk,question_header,question,description,question_img1,question_img2,question_img3,type,option1,option2,option3,option4,option5,objective_answer,text_label1,text_label2,text_label3,text_answer1,text_answer2,text_answer3,answer_hint,status,effective_from,effective_to,created_by,created_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [moduleId,questionHeader,question,description,questionImg1,questionImg2,questionImg3,type,option1,option2,option3,option4,option5,objAnswer,textLabel1,textLabel2,textLabel3,textAnswer1,textAnswer2,textAnswer3,answerHint,status,effectiveFrom,effectiveTo,createdBy,createdDate]
  );
});


  const fetchCreatedQuiz = asyncHandler(async (id) => {
    return await db.query(
    "SELECT module_fk,question_header,question,description,question_img1,question_img2,question_img3,type,option1,option2,option3,option4,option5,objective_answer,text_label1,text_label2,text_label3,text_answer1,text_answer2,text_answer3,answer_hint,status,created_by,created_date FROM quiz WHERE id=? ",
    [id]
  );
  });

  const fetchAllQuiz = asyncHandler(async (moduleId) => {
    return await db.query(
    `SELECT question_header,question,description,question_img1,question_img2,question_img3,type,option1,option2,option3,option4,option5,objective_answer,text_label1,text_label2,text_label3,text_answer1,text_answer2,text_answer3,answer_hint FROM quiz WHERE module_fk=?`,
    [moduleId]
    );
  });

export {
    CreateQuiz,fetchCreatedQuiz,fetchAllQuiz
    };