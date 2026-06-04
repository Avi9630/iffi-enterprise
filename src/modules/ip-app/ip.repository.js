import BaseRepository from '../shared/base.repository.js';
import AppError from '../../utills/AppError.js';
import prisma from '../../configs/prisma.js';

class IpRepository extends BaseRepository {

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

        const ipApplicationModel = await this.getModel('ip_application_forms');
        return ipApplicationModel.findFirst({ where: { id, client_id: clientId } });

        // return this._getCached(
        //     `getByIDIp:${id}:${clientId}`,
        //     async () => {
        //         const ipApplicationModel = await this.getModel('ip_application_forms');
        //         return ipApplicationModel.findFirst({ where: { id, client_id: clientId } });
        //     });
    }

    async updateById(id, data) {
        const model = await this.getModel('ip_application_forms');
        return model.update({
            where: { id, client_id: data.client_id },
            data
        });
    }

    async getByAllSub(id, clientId) {

        const ipApplicationModel = await this.getModel('ip_application_forms');
        const entry = await ipApplicationModel.findUnique({ where: { id } });
        if (!entry) return null;

        const documentModel = await this.getModel('documents');
        const documents = await documentModel.findMany({
            where: {
                context_id: entry.id,
                website_type: 1,
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
            const ipApplicationModel = await this.getModel('ip_application_forms');
            const deleted = await ipApplicationModel.delete({ where: { id } });
            // await this._invalidateCache(`getByAllSubIp:${id}:${clientId}`);
            return deleted;
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

    async deleteMany(ids) {
        try {
            return await prisma.documents.deleteMany({
                where: {
                    id: { in: ids }
                }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new AppError('Documents not found.', 404);
            }
            throw new AppError('Failed to delete documents.', 500);
        }
    }

    // async findByClientId(client_id) {
    //     return await prisma.ip_application_forms.findMany({
    //         where: { client_id },
    //         orderBy: { created_at: 'desc' }
    //     });
    // }

    // async findByFormId(payload) {
    //     return await prisma.ip_application_forms.findUnique({
    //         where: {
    //             id: payload.id,
    //             client_id: payload.client.id
    //         }
    //     });
    // }
}

export default new IpRepository();