import express, { response } from 'express';
const app = express()
var router = express.Router();
import bodyParser from 'body-parser';
app.use(bodyParser.json());
import { doSignUp, doLogin, getData, forgotPassword } from '../helper/user-helper.js';

router.post("/signup", doSignUp) 
router.post("/login", doLogin) 
// router.get("/data", getData) 
router.post("/forgot-password",forgotPassword) 
export default router;