import express, { response } from 'express';
import bodyParser from 'body-parser';
import { createQuiz, getQuizByModuleId } from '../helper/quiz-helper.js';

const app = express();
const router = express.Router();

app.use(bodyParser.json());


router.post("/create", createQuiz) 
router.get("/:id", getQuizByModuleId) 

 
export default router;