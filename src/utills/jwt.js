import jwt from "jsonwebtoken";
import { config } from "../configs/index.js";

export const generateToken = async (email, type = null) => {

    const expiresInMap = {
        activate_token: config.jwt.activateTokenExpiresIn,
        token: config.jwt.tokenExpiresIn,
        default: config.jwt.jwtExpiresIn
    };
    // const expiresInMap = {
    //     activate_token: process.env.ACTIVATE_TOKEN_EXPIRES_IN,
    //     token: process.env.TOKEN_EXPIRES_IN,
    //     default: process.env.JWT_EXPIRES_IN
    // };

    const expiresIn = expiresInMap[type] || expiresInMap.default;

    return jwt.sign(
        {
            email
        },
        config.jwt.secret,
        {
            expiresIn
        }
    );
};

export const verifyToken = async (token) => {

    try {

        const decoded = jwt.verify(token, config.jwt.secret);

        return {
            valid: true,
            expired: false,
            decoded
        };

    } catch (error) {

        return {
            valid: false,
            expired: error.name === 'TokenExpiredError',
            message: error.message
        };

    }

};