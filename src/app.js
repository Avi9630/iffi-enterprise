import compression from 'compression';
import { fileURLToPath } from 'url';
import passport from 'passport';
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import { config } from '../src/configs/index.js';
import { errorMiddleware } from '../src/middlewares/index.js'
import { AppError } from '../src/utills/index.js'
// import apiRoutes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);

const app = express();

// Security header
app.use(helmet());

// Cors
app.use(cors());
app.options('*', cors());

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
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// ── Static — uploaded images (swap this base path for CDN later) ──────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/health', healthRouter);
app.use('/api/v1', v1Router);

// 404 Error
app.use((_req, _res, next) => {
    next(new AppError(404, 'Route not found'));
});

// Testing
app.get('/', (req, resp) => {
    resp.json({
        status: true,
        message: 'IFFI Enterprise API Running'
    });
});

// authRoutes
// app.use('/api', apiRoutes);

// ✅ 404 Handler (must be after all routes)
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'API route not found'
//     });
// });

// app.all('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Cannot find ${req.originalUrl} on this server`
//     });
// });

// errorMiddleware
app.use(errorMiddleware);

export default app;