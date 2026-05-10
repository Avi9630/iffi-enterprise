import { verifyCapcha } from '../../services/recaptcha.service.js';
import catchAsync from '../../utills/catchAsync.js'

const register = async (req, resp, next) => {

    const { captcha, email, mobile } = req.body;

    // *************** Don't remove this code. It will help during when we go live.**************

    const captchaResult = await verifyCapcha(captcha);
    if (!captchaResult.success) {
        return next(new AppError("Captcha verification failed.!!", 422));
    }

    console.log(email);
    return;

    const client = await createClient(req.body);

    await sendMail({
        to: client.email,
        subject: "Verify Your Registration for IFFI Goa",
        templateName: "registration.ejs",
        context: {
            client_name: client.name,
            frontend_base_url: process.env.FRONTEND_URL,
            activate_token: client.activate_token
        }
    });

    return ApiResponse(res, 201,
        "Thank you for IFFI registration. Please click on the link sent to your email for verification process.!!");
};

export default {
    register
};