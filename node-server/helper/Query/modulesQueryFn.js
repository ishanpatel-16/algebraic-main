import asyncHandler from 'express-async-handler';
import db from '../../config/db.js';

const verifyOrderNo = asyncHandler(async (orderno) => {
  return await db.query(
    "SELECT name, parent_id, description,sub_title,sub_description,created_by,created_date FROM modules WHERE order_no=? ",
    [orderno]
  );
});

const createModule = asyncHandler(
  async (
    name,
    parentId,
    description,
    subTitle,
    subDescription,
    orderNo,
    status,
    effectiveFrom,
    effectiveTo,
    createdBy,
    createdDate
  ) => {
    return await db.query(
      "INSERT INTO modules (name, parent_id, description,sub_title,sub_description, order_no,status,effective_from ,effective_to,created_by,created_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        name,
        parentId,
        description,
        subTitle,
        subDescription,
        orderNo,
        status,
        effectiveFrom,
        effectiveTo,
        createdBy,
        createdDate
      ]
    );
  }
);

const fetchCreatedModule = asyncHandler(async (id) => {
  return await db.query(
    "SELECT id,name, parent_id, description,sub_title,sub_description,order_no,status,created_by,created_date FROM modules WHERE id=? ",
    [id]
  );
});

const getModules = asyncHandler(async (userId,ParentId) => {
  return await db.query(
    `select modules.id,modules.name,modules.description,order_no,user_score.score,user_score.quiz_attempt,user_score.total_questions from modules left join user_score on modules.id = user_score.module_fk and user_score.user_fk=? where modules.parent_id =? ORDER BY modules.order_no ASC`,

    [userId,ParentId]
  );
});

export {
  verifyOrderNo,
  createModule,
  fetchCreatedModule,
  getModules,
};
