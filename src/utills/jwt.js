import jwt from "jsonwebtoken";
import { config } from "../configs/index.js";
import { TOKEN_TYPES } from "./constant.js";

const TOKEN_ERRORS = {
    EXPIRED: 'TokenExpiredError',
    INVALID: 'JsonWebTokenError',
    NOT_BEFORE: 'NotBeforeError',
};

export const verifyToken = async (token) => {

    if (!token || typeof token !== 'string') {
        return {
            valid: false,
            expired: false,
            decoded: null,
            message: 'Token must be a non-empty string',
        };
    }

    const secret = config.jwt.secret;
    if (!secret) throw new Error('JWT secret is not configured');

    try {
        const decoded = jwt.verify(token, secret);
        return { valid: true, expired: false, decoded };
    } catch (error) {
        return {
            valid: false,
            expired: error.name === TOKEN_ERRORS.EXPIRED,
            decoded: null,
            message: error.message
        };

    }

};

export const generateAccessToken = async (client) => {
    return jwt.sign(
        { sub: String(client.id), type: TOKEN_TYPES.ACCESS, email: client.email },
        config.jwt.secret,
        { expiresIn: `${config.jwt.jwtAccessTokenExpiresIn}d` }
    );
}

export const generateRefereshToken = async (client) => {
    return jwt.sign({ sub: String(client.id), type: TOKEN_TYPES.REFRESH, email: client.email },
        config.jwt.secret,
        { expiresIn: `${config.jwt.jwtRefereshTokenExpiresIn}d` }
    );
}

export const generateActivationToken = async (email) => {
    return jwt.sign({ email },
        config.jwt.secret,
        { expiresIn: `${config.jwt.jwtActivationTokenExpiresIn}m` }
    );
}