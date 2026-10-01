import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';
import formidable from 'formidable';
import * as util from '../utils/util.js';
const app = express();
app.use(bodyParser.json());

import {
  verifyTopicOrderNo,
  getTopics,
  topicCreate,
  fetchCreatedTopic,
  getTopicByID,
  updateTopics
} from './Query/topic-query.js';

const createTopic = asyncHandler(async (req, res) => {
  //const { moduleId, name, description, content, orderNo, createdBy } = req.body;
  let form =new formidable.IncomingForm();
  let wordTemplateFile = null
  let pdfFile = null
  let effectiveFrom = new Date();
  let effectiveTo = '3050-02-24 21:05:19';
  let createdDate = new Date();;
  let statusInfo = 1;

  form.parse(req,async function (err,fields,files) {
    if(err){
      res.send({status:500,response:[]})
      return;
    }
    const existingOrderno = await verifyTopicOrderNo(fields.orderNo);
    if (existingOrderno.length > 0) {
      return res.json({
        error:
          "Order Number is already registered !! please enter a valid Order Number",
      });
    }
    if (files.templatedata) {

      //removing space in word filename
      const fileName =files.templatedata.originalFilename.replace(/\s/g, "")
      
      //creating randome file name on word file for prevent the duplicates
      const createFilename =
       Date.now() + "-" + Math.round(Math.random() * 1000) + fileName;
   

        wordTemplateFile = await util.saveDocument(
        './documents/word-document/', //Static folder path
        createFilename,
          fs.readFileSync(files.templatedata._writeStream.path)
      )
    

//gnerating word name same as pdf name  
  const wordFileName = wordTemplateFile;
  const extension = path.extname(wordFileName);
  const pdfFilename = wordFileName.slice(0, -extension.length);
  
  //pdf founction 
  pdfFile = util.saveToPdf(wordFileName,pdfFilename)



  }

    const topicDetails = await topicCreate(
      fields.moduleId,
      fields.name,
      fields.description,
      fields.content,
      wordTemplateFile,
      pdfFile,
      fields.orderNo,
      statusInfo,
      effectiveFrom,
      effectiveTo,
      fields.createdBy,
      createdDate

    );

    if (!topicDetails) {
      return res.json({ error: "Failed to create Topic" });
    } else {
      const topicResultData = await fetchCreatedTopic(topicDetails.insertId);
      if (topicResultData.length === 0) {
        return res.json({ error: "Failed to retrieve Topic details" });
      }

      return res.json({ data: topicResultData });
    }
  })

});

const getTopicsByModuleId = asyncHandler(async (req, res) => {
  const moduleId = req.params.id;
  const getAllTopics = await getTopics(moduleId);
  if (getAllTopics.length > 0) {
    return res.json({ data: getAllTopics });
  } else {
    return res.json({ data: [] });
  }
});

const getTopicsById = asyncHandler(async (req, res) => {
  const topicId = req.params.id;

  const topicContent = await getTopicByID(topicId);
  if (topicContent.length > 0) {
    return res.json({ data: topicContent });
  } else {
    return res.json({ data: [] });
  }
});

const updateTopic = asyncHandler(async (req, res) => {
 
  const topicId = req.params.id;
  let isTopicData = await getTopicByID(topicId);
  if (isTopicData.length > 0) {
  
  if(isTopicData[0].word_template_url){
    let existsWordFile = isTopicData[0].word_template_url;
    try {
      fs.unlinkSync('./documents/word-document/'+existsWordFile);

    } catch (err) {
      // Ignore the error if the file doesn't exist
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }
  if(isTopicData[0].pdf_template_url){
   let existsPdfFile = isTopicData[0].pdf_template_url;

        fs.unlink('./documents/pdf-document/'+existsPdfFile, (err) => {
          if (err) {
            console.error(err);
          }
        });
  }

  let form =new formidable.IncomingForm();
  let wordTemplateFile = null
  let pdfFile = null

 form.parse(req,async function (err,fields,files) {
    if(err){
      res.send({status:500,response:[]})
      return;
    }

   if (files.templatedata) {

   //removing space in word filename
      const fileName =files.templatedata.originalFilename.replace(/\s/g, "")
      
      //creating randome file name on word file for prevent the duplicates
      const createFilename =
       Date.now() + "-" + Math.round(Math.random() * 1000) + fileName;
   

        wordTemplateFile = await util.saveDocument(
        './documents/word-document/', //Static folder path
        createFilename,
          fs.readFileSync(files.templatedata._writeStream.path)
      )
    

//gnerating word name same as pdf name  
  const wordFileName = wordTemplateFile;
  const extension = path.extname(wordFileName);
  const pdfFilename = wordFileName.slice(0, -extension.length);
  
  //pdf founction 
  pdfFile = util.saveToPdf(wordFileName,pdfFilename)



  }

 const updateTopicDetails = await updateTopics(
      topicId,
      fields.moduleId,
      fields.name,
      fields.description,
      fields.content,
      wordTemplateFile,
      pdfFile,


    );

    if (!updateTopicDetails) {
      return res.json({ error: "Failed to create Topic" });
    }  else {
      const fetchTopicResult = await getTopicByID(
        topicId
      );
      if (fetchTopicResult.length > 0) {
        return res.json({ data: fetchTopicResult });
      } else {
        return res.json({ error: "Failed " });
      }
    }
  })


  }

});

export {
  createTopic,
  getTopicsByModuleId,
  getTopicsById,
  updateTopic
};
