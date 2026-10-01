import express, { response } from 'express';
import bodyParser from 'body-parser';
import { createFormulaSheet, getFormulaSheet } from '../helper/formulaSheet-helper.js';

const app = express();
const router = express.Router();

app.use(bodyParser.json());



router.post("/create", createFormulaSheet) 
router.get("/get", getFormulaSheet) 




export default router;