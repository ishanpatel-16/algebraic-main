import express from 'express';
import bodyParser from 'body-parser';
import asyncHandler from 'express-async-handler';

const app = express();
app.use(bodyParser.json());

import {
  verifyOrderNo,
  createModule,
  fetchCreatedModule,
  getModules,
} from './Query/modulesQueryFn.js';


const createModuleData = asyncHandler(async (req, res) => {
  const {
    name,
    parentId,
    description,
    subTitle,
    subDescription,
    orderNo,
    createdBy,
  } = req.body;

  // if ( name.trim().length > 0 && orderNo.trim().length > 0){
  const existingOrderno = await verifyOrderNo(orderNo);
  if (existingOrderno.length > 0) {
    return res.json({
      error:
        "Order Number is already registered !! please enter a valid Order Number",
    });
  }

  let effectiveFrom = new Date();
  let effectiveTo = '3050-02-24 21:05:19';
  let createdDate =  new Date();
  let status = 1;
  const moduleDetails = await createModule(
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
  );

  if (!moduleDetails) {
    return res.json({ error: "Failed to create Module" });
  } else {
    const moduleResultData = await fetchCreatedModule(moduleDetails.insertId);
    if (moduleResultData.length === 0) {
      return res.json({ error: "Failed to retrieve Module details" });
    }

    return res.json({ data: moduleResultData });
  }
  // } else {
  //   return res.json({ error: "please enter Valid fields " });
  // }
});

const getAllModules = asyncHandler(async (req, res) => {
  const ParentId = 1;
  const userId = req.params.userid;
  const getAllModulesData = await getModules(userId,ParentId);

  if (getAllModulesData.length > 0 ) {
    let moduleList = getAllModulesData;
    
    moduleList.forEach((e) => {
      if (e.score > 0 && e.total_questions > 0) {
        e.score_percentage = (e.score / e.total_questions) * 100;
      } else {
        e.score_percentage =null;
      }
    });

    return res.json({ data: moduleList });
  } else {
    return res.json({ data: [] });
  }
});

export {
  createModuleData,
  getAllModules,
};
