import AppError from '../utills/AppError.js';
import prisma from '../configs/prisma.js';

class ClientRepository {
    async create(data) {
        try {
            return await prisma.clients.create({
                data,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new AppError('Email or mobile already exists', 409);
            }
            throw error;
        }
    }

    async findByEmail(email) {
        return await prisma.clients.findFirst({
            where: {
                email: email
            }
        });
    }

    async findByMobile(mobile) {
        return await prisma.clients.findFirst({
            where: { mobile }
        });
    }

    async findByActivationToken(token) {
        return await prisma.clients.findFirst({
            where: { activate_token: token }
        });
    }

    async activateClient(id) {
        return await prisma.clients.update({
            where: { id },
            data: {
                active: 1,
                activate_token: null,
                activated_date: new Date()
            }
        });
    }

    async findById(id) {
        return await prisma.clients.findUnique({
            where: { id }
        });
    }

    async updateById(id, data) {
        return await prisma.clients.update({
            where: { id },
            data
        });
    }

    async deleteById(id) {
        return await prisma.clients.delete({
            where: { id }
        });
    }
}

export default new ClientRepository();