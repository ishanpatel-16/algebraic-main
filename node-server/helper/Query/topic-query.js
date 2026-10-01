import asyncHandler from 'express-async-handler';
import db from '../../config/db.js';



const verifyTopicOrderNo = asyncHandler(async (orderno) => {
    return await db.query(
    "SELECT name,module_fk,content,word_template_url,pdf_template_url,description,status,created_by,created_date FROM topics WHERE order_no=? ",
    [orderno]
  );
  });



  const topicCreate = asyncHandler(async (moduleId,name, description,content,wordTemplateFile,pdfFile,orderNo,statusInfo,effectiveFrom,effectiveTo,createdBy,createdDate) => {
    return await db.query(
    "INSERT INTO topics (module_fk,name,description,content,word_template_url,pdf_template_url,order_no,status,effective_from ,effective_to,created_by,created_date) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
    [moduleId,name, description,content,wordTemplateFile,pdfFile,orderNo,statusInfo,effectiveFrom,effectiveTo,createdBy,createdDate]
  );
});

const fetchCreatedTopic = asyncHandler(async (id) => {
    return await db.query(
    "SELECT module_fk,name,description,content,word_template_url,pdf_template_url,order_no,status,created_by,created_date FROM topics WHERE id=? ",
    [id]
  );
  });

  const getTopics = asyncHandler(async (moduleId) => {
    return await db.query(
    `select id,name, description,content,word_template_url,pdf_template_url,order_no,status,effective_from,effective_to,created_by,created_date from topics where module_fk = ?`,
    [moduleId]
    );
  });

  const getTopicByID = asyncHandler(async (topicId) => {
    return await db.query(
    `select id,module_fk,name,description,content,word_template_url,pdf_template_url from topics where id=?`,
    [topicId]
    );
  });

  const updateTopics = asyncHandler(async (topicId,moduleId,name,description,content,wordTemplateFile,pdfFile) => {
    return await db.query(
    `UPDATE  topics SET name=?, description=?,content=?,word_template_url=?,pdf_template_url=? where id=? AND module_fk = ?`,
    [name,description,content,wordTemplateFile,pdfFile,topicId,moduleId]
    );
  });

export {
    verifyTopicOrderNo,getTopics,topicCreate,fetchCreatedTopic,getTopicByID,updateTopics
    };