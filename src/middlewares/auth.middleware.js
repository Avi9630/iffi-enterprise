// middleware/auth.middleware.js
import jwt from 'jsonwebtoken';
import prisma from '../configs/prisma.js';

/**
 * Middleware to verify JWT access token
 * Add this to routes that need authentication
 */
// export const verifyToken = (req, res, next) => {
//     try {
//         // Get token from Authorization header
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Access denied. No token provided."
//             });
//         }

//         // Check if it's a Bearer token
//         const parts = authHeader.split(' ');
//         if (parts.length !== 2 || parts[0] !== 'Bearer') {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid token format. Use: Bearer <token>"
//             });
//         }

//         const token = parts[1];

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Attach user info to request object
//         req.user = decoded;

//         next();
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({
//                 success: false,
//                 message: "Token expired. Please login again."
//             });
//         }

//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid token."
//             });
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Internal server error during authentication."
//         });
//     }
// };

/**
 * Optional: Middleware to verify token but don't fail if missing
 * Useful for routes that work with or without authentication
 */
// export const optionalAuth = (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (authHeader) {
//             const parts = authHeader.split(' ');
//             if (parts.length === 2 && parts[0] === 'Bearer') {
//                 const token = parts[1];
//                 const decoded = jwt.verify(token, process.env.JWT_SECRET);
//                 req.user = decoded;
//             }
//         }
//         next();
//     } catch (error) {
//         next();
//     }
// };

class AuthMiddleware {
    async verifyToken(req, res, next) {
        try {

            const authHeader = req.headers.authorization;
                        
            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: "Access denied. No token provided."
                });
            }

            const parts = authHeader.split(' ');
                       
            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token format. Use: Bearer <token>"
                });
            }

            const token = parts[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
           
            const client = await prisma.clients.findFirst({
                where: {
                    email: decoded.email,
                    token
                }
            });
            
            if (!client) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }

            req.client = client;
            next();

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: "Token expired. Please login again."
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token."
                });
            }

            return res.status(500).json({
                success: false,
                message: "Internal server error during authentication."
            });
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
            // Continue without authentication
            next();
        }
    }
}

export default new AuthMiddleware();