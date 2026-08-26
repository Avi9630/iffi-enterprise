import { AppError } from '../../utills/index.js';
import { database } from '../../configs/index.js';
import BaseRepository from '../shared/base.repository.js';

const prisma = database.client;

class DocumentRepository extends BaseRepository {

    async saveAndUpdate(criteria, data) {
        const documentModel = await this.getModel('documents');

        try {

            // const existingDocument = await prisma.documents.findFirst({
            //     where: {
            //         context_id: criteria.context_id,
            //         website_type: criteria.website_type,
            //         document_type: criteria.document_type,
            //     }
            // });

            const existingDocument = await documentModel.findFirst({
                where: {
                    context_id: criteria.context_id,
                    website_type: criteria.website_type,
                    document_type: criteria.document_type,
                }
            });

            let document;
            if (existingDocument) {
                // Update
                document = await documentModel.update({
                    where: { id: existingDocument.id },
                    data: data
                });
            } else {
                // Create
                document = await documentModel.create({
                    data: { ...criteria, ...data }
                });
            }

            return {
                success: true,
                data: document
            };
        } catch (error) {
            console.error('Error in saveAndUpdate:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async checkExisting(criteria) {
        // return await prisma.documents.findFirst({
        //     where: {
        //         context_id: criteria.context_id,
        //         website_type: criteria.website_type,
        //         document_type: criteria.document_type
        //     }
        // });

        const documentModel = await this.getModel('documents');
        return documentModel.findFirst({
            where: {
                context_id: criteria.context_id,
                website_type: criteria.website_type,
                document_type: criteria.document_type
            }
        });
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

}
export default new DocumentRepository();