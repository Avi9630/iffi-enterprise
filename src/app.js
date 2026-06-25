import { authLimiter, errorMiddleware, globalLimiter } from '../src/middlewares/index.js'
import { config } from '../src/configs/index.js';
import { fileURLToPath } from 'url';

import AppError from './utills/AppError.js';
import compression from 'compression';
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);

const app = express();

app.use(helmet()); //// SECURITY HEADER

app.use(cors()); ////CORS

//app.options('/*', cors());

// HTTP logger
if (config.env !== 'test') {
    app.use(morgan('dev'));
}

// Body Parse
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Compression
app.use(compression());

// ── Static — uploaded images (swap this base path for CDN later) ──────────────
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, 'public')));

// Rate Limiting-------------------------------------------------
app.use(globalLimiter);
if (config.env === 'development' || config.env === 'production') {
    app.use('/api/v2/auth', authLimiter);
}

// Routes-------------------------------------------------
import testingRoutes from './routes/testing.route.js';
import routes from './routes/index.js';

app.use('/', testingRoutes);
app.use('/api/v2', routes);

// ✅ 404 Handler (must be after all routes)
app.use((req, res, next) => {
    next(new AppError('Route not found', 404));
});

// errorMiddleware
app.use(errorMiddleware);

export default app;