import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

// Import routes
import apiRoutes from './routes/index.js';

const app = express();

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

// errorMiddleware
// import errorMiddleware from './middlewares/error.middleware.js';
// app.use(errorMiddleware);

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
import errorMiddleware from '../src/middleware/errorHandler.js';
app.use(errorMiddleware);

export default app;