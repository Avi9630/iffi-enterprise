// import AppError from '../utills/AppError.js';
import prisma from '../configs/prisma.js';

class DocumentRepository {
    // async saveAndUpdate(uniqueId, data) {
    //     try {
    //         const document = await prisma.documents.upsert({
    //             where: { id: uniqueId },
    //             update: data,
    //             create: { id: uniqueId, ...data }
    //         });

    //         return document;
    //     } catch (error) {
    //         throw new Error(`Upsert failed: ${error.message}`);
    //     }
    // }

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
}

export default new DocumentRepository();