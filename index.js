require('dotenv').config();
require('express-async-errors');


const rateLimiter = require('express-rate-limit');

const express = require('express');
const app = express();

const connectDB = require('./db/index');
const authenticateUser = require('./middleware/authentication');
// routers
const userRouter = require('./routes/user');
const jobsRouter = require('./routes/jobs');
const employerRouter = require('./routes/employer');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());

var cors = require('cors');

app.use(cors());

// routes
app.use('/api/user', userRouter);
app.use('/api/employer', employerRouter);

app.use('/api/jobs', authenticateUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_DB);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();