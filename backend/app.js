import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import config from './config/index.js';
import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFound } from './middleware/error.js';
import router from './routes/index.js';
import './config/passport.js';

const app = express();

// Initialize Passport
app.use(passport.initialize());

app.use(helmet());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true
  })
);
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Om Cycle Store API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);
app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;
