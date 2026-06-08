import { AppError } from '../../utills/index.js';
import { database, logger } from '../../configs/index.js';

const prisma = database.client

class AuthRepository {

    async findByEmail(email) {
        return await prisma.clients.findUnique({
            where: {
                email
            }
        });
    }

    async findByMobile(mobile) {
        return await prisma.clients.findUnique({
            where: {
                mobile
            }
        });
    }

    async create(data) {
        try {
            return await prisma.clients.create({
                data,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new AppError('Email or mobile already exists', 409);
            }
            if (error.code === 'P2003') {
                throw new AppError(error.message, 400, 'BAD_REQUEST');
            }
            throw error;
        }
    }

    async clientTypeById(clientTypeId) {
        return await prisma.client_types.findUnique({
            where: {
                id: clientTypeId,
                status: 1
            }
        });
    }

    async findClientByActivationToken(token) {
        return await prisma.clients.findFirst({
            where: {
                activation_token: token
            }
        });
    }

    async accountActivateByClientId(clientId) {
        return await prisma.clients.update({
            where: { id: clientId },
            data: {
                status: 1,
                activation_token: null,
            }
        });
    }

    async updateClientById(clientId, data) {
        return await prisma.clients.update({
            where: { id: clientId },
            data: data
        });
    }

    async getOtpCodesByClient(clientId) {
        return await prisma.otp_codes.findUnique({
            where: {
                client_id: clientId
            }
        });
    }

    async addOtpcode(data) {
        try {
            return await prisma.otp_codes.create({
                data,
            });
        } catch (error) {
            if (error.code === 'P2003') {
                throw new AppError(error.message, 400, 'BAD_REQUEST');
            }
            throw error;
        }
    }

    async updateOtpById(id, data) {
        return await prisma.otp_codes.update({
            where: { id },
            data: data
        });
    }

}

export default new AuthRepository();