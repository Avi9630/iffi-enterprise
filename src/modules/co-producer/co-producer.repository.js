import BaseRepository from '../shared/base.repository.js';
import AppError from '../../utills/AppError.js';
import prisma from '../../configs/prisma.js';

class CoProducerRepository extends BaseRepository {

    async create(data) {

        const ipCoProducersModel = await this.getModel('ip_co_producers');

        try {
            return ipCoProducersModel.create({ data });

            // return await prisma.ip_co_producers.create({
            //     data
            // });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new AppError('Something went wrong during co-producers add.!', 409);
            }
            throw error;
        }
    }

    async updateByFormId(id, data) {

        const ipCoProducersModel = await this.getModel('ip_co_producers');

        const form = await ipCoProducersModel.findUnique({
            where: {
                id: BigInt(id),
            }
        });

        // const form = await prisma.ip_co_producers.findUnique({
        //     where: {
        //         id: BigInt(id),
        //     }
        // });

        if (!form) {
            throw new AppError('Form not found or unauthorized.', 404);
        }

        return ipCoProducersModel.update({
            where: {
                id: BigInt(id)
            },
            data
        });

        // return await prisma.ip_co_producers.update({
        //     where: {
        //         id: BigInt(id)
        //     },
        //     data
        // });
    }

    async findByFormId(id) {
        const ipCoProducersModel = await this.getModel('ip_co_producers');
        return ipCoProducersModel.findFirst({ where: { id } });

        // return await prisma.ip_co_producers.findFirst({
        //     where: {
        //         id
        //     }
        // });
    }

    async validateIpForm(ipFormId, clientId) {
        const ipApplicationFormModel = await this.getModel('ip_application_forms');
        return ipApplicationFormModel.findUnique({
            where: { id: ipFormId, client_id: clientId }
        });
        // return await prisma.ip_application_forms.findUnique({
        //     where: {
        //         id: ipFormId,
        //         client_id: clientId
        //     }
        // });
    }

    async findByIdWithDoc(id) {

        const ipCoProducersModel = await this.getModel('ip_co_producers');

        const coProducer = await ipCoProducersModel.findFirst({
            where: { id }
        });

        // const coProducer = await prisma.ip_co_producers.findFirst({
        //     where: { id }
        // });

        if (!coProducer) return null;

        const documentsModel = await this.getModel('documents');
        const documents = await documentsModel.findMany({
            where: {
                context_id: coProducer.id,
                document_type: { in: [18, 13] }
            }
        });

        // const documents = await prisma.documents.findMany({
        //     where: {
        //         context_id: coProducer.id,
        //         document_type: { in: [18, 13] }
        //     }
        // });

        return {
            ...coProducer,
            documents
        };
    }

    async getAllCoProducerByIpFormId(id) {

        const ipCoProducersModel = await this.getModel('ip_co_producers');

        const coProducers = await ipCoProducersModel.findMany({
            where: { ip_application_form_id: id }
        });

        // const coProducers = await prisma.ip_co_producers.findMany({
        //     where: { ip_application_form_id: id }
        // });

        if (!coProducers.length) return [];


        const documentsModel = await this.getModel('documents');

        const allDocuments = await documentsModel.findMany({
            where: {
                context_id: { in: coProducers.map(coProducer => coProducer.id) },
                document_type: { in: [17, 12] }
            }
        });

        // const allDocuments = await prisma.documents.findMany({
        //     where: {
        //         context_id: { in: coProducers.map(coProducer => coProducer.id) },
        //         document_type: { in: [17, 12] }
        //     }
        // });

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

        const ipCoProducersModel = await this.getModel('ip_co_producers');

        const deleted = await ipCoProducersModel.delete({ where: { id } });

        // const deleted = await prisma.ip_co_producers.delete({
        //     where: { id }
        // });

        if (!deleted) throw new AppError('Co-producer not found.', 404);

        return deleted;
    }
}

export default new CoProducerRepository();