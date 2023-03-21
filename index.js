require('dotenv').config();
require('express-async-errors');

const { GridFSBucket } = require('mongoose').mongo;
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');

const rateLimiter = require('express-rate-limit');
const express = require('express');
const app = express();

const connectDB = require('./db/index');
const authenticateUser = require('./middleware/authentication');
const authenticateEmployer = require('./middleware/employerauthentication');

// routers
const userRouter = require('./routes/user');
const jobsRouter = require('./routes/jobs');
const employerRouter = require('./routes/employer');
const applicationRouter = require('./routes/application');
const fileRouter = require('./routes/file');
const resumeRouter = require('./routes/resume');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());

var cors = require('cors');
app.use(cors());
app.use(fileUpload());


// Middleware to set gfs on the request object
const setGfsMiddleware = (req, res, next) => {
  const db = mongoose.connection.db;
  //console.log(db)
  const gfs = new GridFSBucket(db, { bucketName: 'uploads' });
 // console.log(gfs)
  req.gfs = gfs;
  next();
};

// routes
app.use('/api/user', userRouter);
app.use('/api/employer', employerRouter);
app.use('/api/application', authenticateUser, applicationRouter);
app.use('/api/jobs', authenticateEmployer, jobsRouter);
app.use('/api/resume', resumeRouter);

// Use setGfsMiddleware before using fileRouter
app.use('/api/file', setGfsMiddleware, fileRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    const db = await connectDB(process.env.MONGO_DB);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
    app.set('db', db); // set db connection on app object
  } catch (error) {
    console.log(error);
  }
};

start();