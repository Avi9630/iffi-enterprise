
import errorMiddleware from '../src/middlewares/error.middleware.js';
import apiRoutes from './routes/index.js';
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static files - PUBLIC folder ko serve karein
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Testing
app.get('/', (req, resp) => {
    resp.json({
        status: true,
        message: 'IFFI Enterprise API Running'
    });
});

// authRoutes
app.use('/api', apiRoutes);

// ✅ 404 Handler (must be after all routes)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API route not found'
    });
});

// app.all('*', (req, res) => {
//     res.status(404).json({
//         success: false,
//         message: `Cannot find ${req.originalUrl} on this server`
//     });
// });

// errorMiddleware
app.use(errorMiddleware);

export default app;