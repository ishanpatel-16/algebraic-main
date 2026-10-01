import asyncHandler from 'express-async-handler';
import db from '../../config/db.js';

const CreateQuizScore = asyncHandler(async (userId, moduleId, score, quizAttempt, totalQuestion, createdDate) => {
    return await db.query(
    `
    INSERT INTO user_score(user_fk, module_fk,score,quiz_attempt,total_questions,created_date) VALUES (?,?,?,?,?,?);
    INSERT INTO quiz_attempts(user_fk, module_fk, score, attempt_num, total_questions, created_date) VALUES (?,?,?,?,?,?);
    `,
    [userId, moduleId, score,quizAttempt,totalQuestion,createdDate, userId,moduleId,score,quizAttempt,totalQuestion,createdDate]
  );
});

const verifyQuizResult = asyncHandler(async (userId, moduleId) => {
    return await db.query(
         `SELECT user_fk,module_fk,score,quiz_attempt,total_questions FROM user_score WHERE user_fk=? AND module_fk=? `,
    [userId,moduleId]
    );
  });

const updateQuizCount = asyncHandler(async (userId, moduleId, score, count, totalQuestion, createdDate) => {
    return await db.query(
    `
    UPDATE user_score SET score = CASE WHEN ? > score THEN ? ELSE score END,quiz_attempt=?,total_questions=? WHERE user_fk=? AND module_fk=?;
    INSERT INTO quiz_attempts(user_fk, module_fk, score, attempt_num, total_questions, created_date) VALUES (?,?,?,?,?,?);
    `,
    [score,score,count,totalQuestion,userId,moduleId, userId,moduleId,score,count,totalQuestion,createdDate]
    );
  });

const fetchQuizScore = asyncHandler(async (Id) => {
    return await db.query(
         `SELECT user_fk,module_fk,score,quiz_attempt,total_questions FROM user_score WHERE id=?`,
    [Id]
    );
  });

const getQuizResultById = asyncHandler(async (userId) => {
    return await db.query(
    `SELECT module_fk,score,quiz_attempt,total_questions FROM user_score WHERE user_fk=?`,
    [userId]
    );
  });

const getQuizAttemptsByModuleId = asyncHandler(async (moduleId, userId) => {
    return await db.query(
    `SELECT module_fk,score,attempt_num,created_date,total_questions FROM quiz_attempts WHERE module_fk=? AND user_fk=?`,
    [moduleId, userId]
    );
  });

export {
  CreateQuizScore,getQuizResultById,verifyQuizResult,updateQuizCount,fetchQuizScore, getQuizAttemptsByModuleId
};