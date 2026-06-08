import { config } from '../configs/config.js';
import AppError from '../utills/AppError.js';
import prisma from '../configs/prisma.js';
import jwt from 'jsonwebtoken';

class AuthMiddleware {

    async verifyToken(req, res, next) {
        try {

            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return next(new AppError("Authorization header missing.😒", 401));
            }

            const parts = authHeader.split(" ");
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return next(new AppError("Invalid authorization format.😒", 401));
            }

            const token = parts[1];
            const decoded = jwt.verify(token, config.jwt.secret);
            const client = await prisma.clients.findFirst({ where: { email: decoded.email, token } });

            if (!client) {
                return next(new AppError("Session expired. Please login again.😒", 401));
            }

            req.clientDetails = { id: client.id, email: client.email };
            next();

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(new AppError("Token expired. Please login again.😒", 401));
            }

            if (error.name === 'JsonWebTokenError') {
                return next(new AppError("Invalid token.😒", 401));
            }
            return next(new AppError("Internal server error during authentication.😒", 500));
        }
    }

    async optionalAuth(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const parts = authHeader.split(' ');
                if (parts.length === 2 && parts[0] === 'Bearer') {
                    const token = parts[1];
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    req.user = decoded;
                }
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthMiddleware();