// enviroment variables
require('dotenv').config();

// third party libs
require('colors');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

// server configuration
const { port } = require('./config/express');

// middleware
const { errorHandler } = require('./middleware/errorHandler');

// db connection
const { connectDB } = require('./config/db');
connectDB();

// express application
const app = express();

// allow cross origin requests
app.use(cors());
// nested query parameters configuration
app.set('query parser', 'extended');
// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount routers
app.use('/v1', require('./routes/v1'));

app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`.cyan);
  console.log(`App listening on port: ${port}`.cyan);
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Database Error: ${err.message}`.red.underline);
  // close server and exit process
  server.close(() => process.exit(1));
});
