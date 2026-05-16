// import AppError from '../utills/AppError.js';
import prisma from '../configs/prisma.js';

class DocumentRepository {

    async saveAndUpdate(criteria, data) {
        try {

            const existingDocument = await prisma.documents.findFirst({
                where: {
                    context_id: criteria.context_id,
                    website_type: criteria.website_type,
                    document_type: criteria.document_type,
                }
            });

            let document;
            if (existingDocument) {
                // Update karo
                document = await prisma.documents.update({
                    where: { id: existingDocument.id },
                    data: data
                });
            } else {
                // Create karo
                document = await prisma.documents.create({
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
        return await prisma.documents.findFirst({
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