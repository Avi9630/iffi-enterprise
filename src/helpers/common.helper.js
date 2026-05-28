import crypto from 'crypto';

class CommonHelper {

    async generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    async getClientIP(req) {
        return (
            req.headers['x-forwarded-for']?.split(',')[0] ||
            req.socket?.remoteAddress ||
            req.ip
        );
    }

    async serializeBigInt(obj) {
        return JSON.parse(
            JSON.stringify(
                obj,
                (_, value) =>
                    typeof value === 'bigint'
                        ? value.toString()
                        : value
            )
        );
    };
}

export default new CommonHelper();