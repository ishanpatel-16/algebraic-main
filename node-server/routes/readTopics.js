import express, { response } from 'express';
import bodyParser from 'body-parser';
import { readTopic, getReadTopics } from '../helper/readTopic-helper.js';

const app = express();
const router = express.Router();

app.use(bodyParser.json());


router.post("/create", readTopic);
router.get("/:id", getReadTopics);
export default router;