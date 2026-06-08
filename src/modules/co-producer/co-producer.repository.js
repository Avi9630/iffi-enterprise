import AppError from '../../utills/AppError.js';
import prisma from '../../configs/prisma.js';

class CoProducerRepository {

    async create(data) {
        try {
            return await prisma.ip_co_producers.create({
                data
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new AppError('Something went wrong during co-producers add.!', 409);
            }
            throw error;
        }
    }

    async updateByFormId(id, data) {

        const form = await prisma.ip_co_producers.findUnique({
            where: {
                id: BigInt(id),
            }
        });

        if (!form) {
            throw new AppError('Form not found or unauthorized.', 404);
        }

        return await prisma.ip_co_producers.update({
            where: {
                id: BigInt(id)
            },
            data
        });
    }

    async findByFormId(id) {
        return await prisma.ip_co_producers.findFirst({
            where: {
                id
            }
        });
    }

    async validateIpForm(ipFormId, clientId) {
        return await prisma.ip_application_forms.findUnique({
            where: {
                id: ipFormId,
                client_id: clientId
            }
        });
    }

    async findByIdWithDoc(id) {

        const coProducer = await prisma.ip_co_producers.findFirst({
            where: { id }
        });

        if (!coProducer) return null;

        const documents = await prisma.documents.findMany({
            where: {
                context_id: coProducer.id,
                document_type: { in: [18, 13] }
            }
        });

        return {
            ...coProducer,
            documents
        };
    }

    async getAllCoProducerByIpFormId(id) {
        const coProducers = await prisma.ip_co_producers.findMany({
            where: { ip_application_form_id: id }
        });

        if (!coProducers.length) return [];

        const allDocuments = await prisma.documents.findMany({
            where: {
                context_id: { in: coProducers.map(coProducer => coProducer.id) },
                document_type: { in: [17, 12] }
            }
        });

        const documentsByContextId = allDocuments.reduce((acc, doc) => {
            if (!acc[doc.context_id]) acc[doc.context_id] = [];
            acc[doc.context_id].push(doc);
            return acc;
        }, {});

        return coProducers.map(coProducer => ({
            ...coProducer,
            documents: documentsByContextId[coProducer.id] ?? []
        }));
    }

    async delete(id) {
        const deleted = await prisma.ip_co_producers.delete({
            where: { id }
        });

        if (!deleted) throw new AppError('Co-producer not found.', 404);

        return deleted;
    }
}

export default new CoProducerRepository();