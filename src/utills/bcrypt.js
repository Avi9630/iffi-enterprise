import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
};

/**
 * Compare plain text password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
export const comparePassword = async (password, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Error comparing password: ' + error.message);
    }
};

/**
 * Compare password synchronously (use sparingly, prefer async)
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {boolean} - True if passwords match, false otherwise
 */
export const comparePasswordSync = (password, hashedPassword) => {
    try {
        return bcrypt.compareSync(password, hashedPassword);
    } catch (error) {
        throw new Error('Error comparing password: ' + error.message);
    }
};

/**
 * Generate hash synchronously (use sparingly, prefer async)
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
export const hashPasswordSync = (password) => {
    try {
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        return bcrypt.hashSync(password, salt);
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
};