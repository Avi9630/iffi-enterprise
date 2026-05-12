import jwt from "jsonwebtoken";

export const generateToken = async (email, type = null) => {

    const expiresInMap = {
        activate_token: process.env.ACTIVATE_TOKEN_EXPIRES_IN,
        token: process.env.TOKEN_EXPIRES_IN,
        default: process.env.JWT_EXPIRES_IN
    };

    const expiresIn = expiresInMap[type] || expiresInMap.default;

    return jwt.sign(
        {
            email
        },
        process.env.JWT_SECRET,
        {
            expiresIn
        }
    );
};

export const verifyToken = async (token) => {

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

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