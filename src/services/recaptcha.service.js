import axios from 'axios';

export const verifyCapcha = async (captcha) => {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            new URLSearchParams({
                secret: secretKey,
                response: captchaToken
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data;

    } catch (error) {
        console.error('Captcha verify error:', error.message);
        return { success: false };
    }
}