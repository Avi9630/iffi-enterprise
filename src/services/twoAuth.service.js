import twoAuthRepository from "../queries/twoAuth.repository.js";
import commonHelper from "../helpers/common.helper.js";
import AppError from '../utills/AppError.js';
import prisma from '../configs/prisma.js';

class TwoAuthService {

    async checkTwoAuth(req, client) {

        const twoAuth = await twoAuthRepository.findByEmail(client.email);

        if (twoAuth) {
            twoAuth.authcode = await commonHelper.generateOTP();
            twoAuth.is_verifed = 0;
            twoAuth.ipaddress = await commonHelper.getClientIP(req);
            await twoAuthRepository.updateById(twoAuth.id, twoAuth);
            return twoAuth;
        }

        const dataToAdd = {
            email: client.email,
            mobile: client.mobile,
            authcode: await commonHelper.generateOTP(),
            is_verifed: 0,
            ipaddress: await commonHelper.getClientIP(req),
            date: new Date()
        };

        return await twoAuthRepository.create(dataToAdd);
    }

    async otpVerify(client, payload) {

        const twoAuth = await prisma.twoauths.findFirst({
            where: {
                email: client.email,
                is_verifed: 0
            }
        })

        if (!twoAuth) {
            throw new AppError('Authdata not found.! Or OTP already verified.! Please reset password.!', 422);
        }

        if (twoAuth.authcode != payload.otp) {
            throw new AppError('Invalid otp entered.! Please reset password.!', 422);
        }
        twoAuth.is_verifed = 1;
        await twoAuthRepository.updateById(twoAuth.id, twoAuth);
        return twoAuth;
    }
}

export default new TwoAuthService();