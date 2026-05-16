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

    async updateById(id, data) {

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

    // async findByIdWithDoc(id, clientId) {

    //     const ipForm = await prisma.ip_application_forms.findFirst({
    //         where: { id, client_id: clientId }
    //     });

    //     if (!ipForm) return null;

    //     const documents = await prisma.documents.findMany({
    //         where: {
    //             context_id: ipForm.id,
    //             document_type: { in: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] }
    //         }
    //     });

    //     return {
    //         ...ipForm,
    //         documents
    //     };
    // }

}

export default new IpRepository();