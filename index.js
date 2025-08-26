import express from 'express';
import user from './routes/user.js';
import formulaSheet from './routes/formula-sheet.js';
import modules from './routes/modules.js';
import topics from './routes/topics.js';
import quiz from './routes/quiz.js';
import readTopics from './routes/readTopics.js';
import RateLimiterMemory from "rate-limiter-flexible/lib/RateLimiterMemory.js";
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path
const __filename = fileURLToPath(import.meta.url);
// Get current directory path
const __dirname = path.dirname(__filename);


import bodyParser from 'body-parser';
const app = express();
app.use(bodyParser.json());
import cors from 'cors';
app.use(cors());

// Quiz images
const quizImagesPath = path.join(__dirname, "media/quizImages/");

app.get("/:imageName", (req, res) => {
  const requestedImage = path.join(quizImagesPath, req.params.imageName);

  // Check if file exists
  if (fs.existsSync(requestedImage)) {
    res.sendFile(requestedImage);
  } else {
    // Fallback image
    res.sendFile(path.join(quizImagesPath, "default.png"));
  }
});

app.use(express.static(__dirname + "/documents/word-document"));
app.use(express.static(__dirname + "/documents/pdf-document"));
app.use('/',user)
app.use('/formula-sheet',formulaSheet)
app.use('/modules',modules)
app.use('/modules/topics',topics)
app.use('/modules/quiz',quiz)
app.use('/modules/read-topics',readTopics)
app.get("/", (req, res) => {
    res.send("Web API");
})

// Config rate limiter
const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 1
});

const rateLimiterMiddleware = (req, res, next) => {
    rateLimiter.consume(req.ip)
        .then(() => {
            next();
        })
        .catch(() => {
            res.status(429).send("Too Many Requests");
        });
};

app.use(rateLimiterMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`server running on ${PORT}`));