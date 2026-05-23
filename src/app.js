import { authLimiter, errorMiddleware, globalLimiter } from '../src/middlewares/index.js'
import { config } from '../src/configs/index.js';
import AppError from './utills/AppError.js';
import compression from 'compression';
import { fileURLToPath } from 'url';
import passport from 'passport';
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);

const app = express();

// Security header
app.use(helmet());

// Cors
app.use(cors());
// app.options('/*', cors());

// HTTP logger
if (config.env !== 'test') {
    app.use(morgan('dev'));
}

// Body Parse
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Compression
app.use(compression());

// Rate Limiting
app.use(globalLimiter);
if (config.env === 'production') {
    app.use('/api/v1/auth', authLimiter);
}

// Passport
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// ── Static — uploaded images (swap this base path for CDN later) ──────────────
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
import routes from './routes/index.js';
app.use('/api', routes);

// Testing
app.get('/', (req, resp) => {
    resp.json({
        status: true,
        message: 'IFFI Enterprise API Running'
    });
});

// ✅ 404 Handler (must be after all routes)
app.use((req, res, next) => {
    next(new AppError('Route not found', 404));
});

// errorMiddleware
app.use(errorMiddleware);

export default app;