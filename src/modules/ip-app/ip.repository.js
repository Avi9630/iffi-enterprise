import AppError from '../../utills/AppError.js';
import prisma from '../../configs/prisma.js';

class IpRepository {

    async getModel(modelName) {
        const model = prisma[modelName];
        if (!model || typeof model.findMany !== 'function') {
            throw new Error(`Prisma model "${modelName}" not found. Check your schema.prisma.`);
        }
        return model;
    }

    async create(data) {
        try {
            const model = await this.getModel('ip_application_forms');
            return model.create({ data });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new AppError('Duplicate entry detected.', 409);
            }
            if (error.code === 'P2003') {
                throw new AppError('Invalid data provided.', 400, 'BAD_REQUEST');
            }
            throw error;
        }
    }

    async getById(id, clientId) {
        const model = await this.getModel('ip_application_forms');
        return model.findFirst({
            where: { id, client_id: clientId }
        });
    }

    async updateById(id, data) {
        const model = await this.getModel('ip_application_forms'); 
        return model.update({
            where: { id, client_id: data.client_id },
            data
        });
    }

    // async updateById(id, data) {
    //     const form = await prisma.ip_application_forms.findFirst({
    //         where: {
    //             id: BigInt(id),
    //             client_id: BigInt(data.client_id)
    //         }
    //     });

    //     if (!form) {
    //         throw new AppError('Form not found or unauthorized.', 404);
    //     }

    //     return await prisma.ip_application_forms.update({
    //         where: {
    //             id: BigInt(id)
    //         },
    //         data
    //     });
    // }

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

    async findById(id, clientId) {

        const entry = await prisma.ip_application_forms.findFirst({
            where: { id, client_id: clientId }
        });

        if (!entry) return null;

        const documents = await prisma.documents.findMany({
            where: {
                context_id: entry.id,
                document_type: { in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }
            }
        });

        return {
            ...entry,
            documents
        };
    }

    async delete(id) {
        try {
            return await prisma.ip_application_forms.delete({ where: { id } });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new AppError('IP application form not found.', 404);
            }
            if (error.code === 'P2003') {
                throw new AppError('Cannot delete form, related records exist.', 409);
            }
            throw new AppError('Failed to delete form.', 500);
        }
    }
}

export default new IpRepository();