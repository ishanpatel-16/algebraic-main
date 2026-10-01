import express, { response } from 'express';
import bodyParser from 'body-parser';
import { createTopic, getTopicsByModuleId, getTopicsById, updateTopic } from '../helper/topic-helper.js';

const app = express();
const router = express.Router();

app.use(bodyParser.json());

router.post("/create", createTopic) 
router.get("/:id", getTopicsByModuleId) 

router.get("/read/:id", getTopicsById) 
router.post("/update/:id", updateTopic) 
export default router;