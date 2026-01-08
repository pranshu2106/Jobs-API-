require('dotenv').config();
require('express-async-errors');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const express = require('express');
const app = express();

const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const expressratelimiter = require('express-rate-limit');


const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
const connectDB = require('./db/connect');
const authMiddleware = require('./middleware/authentication');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.set('trust proxy', 1);
app.use(
  expressratelimiter({
    windowsMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(xss());
// Allowed origins for CORS (development + production)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  process.env.FRONTEND_URL, // Production frontend URL (set in Render)
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow requests with no origin (Postman, etc.)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false); // block without throwing error
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // include OPTIONS for preflight
  credentials: true
}));
app.use(helmet());

// extra packages

// routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Backend Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
