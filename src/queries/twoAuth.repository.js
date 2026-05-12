import AppError from '../utills/AppError.js';
import prisma from '../configs/prisma.js';

class TwoAuthRepository {

    async create(data) {
        try {
            return await prisma.twoauths.create({
                data,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new AppError('Something went wrong.!', 409);
            }
            throw error;
        }
    }

    async findByEmail(email) {
        return await prisma.twoauths.findFirst({
            where: {
                email: email
            }
        });
    }

    async findByMobile(mobile) {
        return await prisma.twoauths.findFirst({
            where: { mobile }
        });
    }

    // async findByActivationToken(token) {
    //     return await prisma.clients.findFirst({
    //         where: { activate_token: token }
    //     });
    // }

    // async activateClient(id) {
    //     return await prisma.clients.update({
    //         where: { id },
    //         data: {
    //             active: 1,
    //             activate_token: null,
    //             activated_date: new Date()
    //         }
    //     });
    // }

    async findById(id) {
        return await prisma.twoauths.findUnique({
            where: { id }
        });
    }

    async updateById(id, data) {
        return await prisma.twoauths.update({
            where: { id },
            data
        });
    }

    async deleteById(id) {
        return await prisma.twoauths.delete({
            where: { id }
        });
    }
}

export default new TwoAuthRepository();