import AppError from '../../utills/AppError.js';
import prisma from '../../configs/prisma.js';

class IpRepository {

    async create(data) {
        try {
            return await prisma.ip_application_forms.create({
                data
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new AppError('Duplicate entry detected.', 409);
            }
            throw error;
        }
    }

    // async updateByFormId(id, data) {
    //     try {
    //         return await prisma.ip_application_forms.upsert({
    //             where: {
    //                 id_step: {
    //                     id,
    //                     step
    //                 }
    //             },
    //             update: data,
    //             create: {
    //                 id,
    //                 step,
    //                 ...data
    //             }
    //         });
    //     } catch (error) {
    //         if (error.code === 'P2025') {
    //             throw new AppError('Form not found.', 404);
    //         }
    //         throw error;
    //     }
    // }

    async updateByFormId(id, data) {

        const form = await prisma.ip_application_forms.findFirst({
            where: {
                id: BigInt(id),
                client_id: BigInt(data.client_id)
            }
        });

        if (!form) {
            throw new AppError('Form not found or unauthorized.', 404);
        }

        return await prisma.ip_application_forms.update({
            where: {
                id: BigInt(id)
            },
            data
        });
    }

    async findByClientId(client_id) {
        return await prisma.ip_application_forms.findMany({
            where: { client_id },
            orderBy: { created_at: 'desc' }
        });
    }

    async findByFormId(payload) {
        return await prisma.ip_application_forms.findUnique({
            where: {
                id: payload.id,
                client_id: payload.client.id
            }
        });
    }

    async findFormSteps(form_id) {
        return await prisma.ip_application_forms.findMany({
            where: { form_id },
            orderBy: { step: 'asc' }
        });
    }

    async delete(form_id) {
        try {
            return await prisma.ip_application_forms.deleteMany({
                where: { form_id }
            });
        } catch (error) {
            throw new AppError('Failed to delete form.', 500);
        }
    }
}

export default new IpRepository();