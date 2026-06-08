import documentRepository from "../queries/document.repository.js";
import { IP_DOCUMENT_TYPE } from "../constants/index.js";
import AppError from "../utills/AppError.js";
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv'
import path from 'path';
dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileUploadService {

    async upload(payload) {

        const { websiteType, contextId, files } = payload;

        const uploadedFiles = [];

        for (const file of files) {

            const fieldName = file.fieldname.toUpperCase();
            const documentType = IP_DOCUMENT_TYPE[fieldName];

            if (documentType === undefined) {
                throw new AppError('Envalid document key.!', 422);
            }

            const fileDetails = await this.fileDetails(file);

            const criteria = {
                context_id: contextId,
                website_type: websiteType,
                document_type: documentType,
            };

            const documentDetails = await documentRepository.checkExisting(criteria);
            if (documentDetails) {
                await this.removeLocally(documentDetails);
            }

            const localResult = await this.saveToLocal(file.buffer, fileDetails.modifiedName, fileDetails.directory);
            // console.log(localResult);
            // return;
            const fileData = {
                doc_name: fileDetails.originalName,
                modified_name: fileDetails.modifiedName,
                doc_path: localResult.fullPath,
            };
            const uploadResult = await documentRepository.saveAndUpdate(criteria, fileData);
            uploadedFiles.push(uploadResult);
        }
        return uploadedFiles;
    }

    async fileDetails(file) {

        const originalName = file.originalname;
        const fileName = path.parse(originalName).name;
        const extension = path.extname(originalName);
        const modifiedName = `${Date.now()}${extension}`;
        const directory = path.join(__dirname, "../..", "public/uploads");
        return { originalName, fileName, extension, modifiedName, directory };

    }

    async saveToLocal(buffer, filename, directory) {

        try {
            await fs.access(directory);
        } catch {
            await fs.mkdir(directory, { recursive: true });
        }

        const filePath = path.join(directory, filename);
        await fs.writeFile(filePath, buffer);
        const relativePath = filePath.split('public')[1].replace(/\\/g, '/');
        return {
            url: relativePath,
            path: filePath,
            fullPath: `${process.env.BASE_PATH}${relativePath}`
        };
    }

    async removeLocally(documentDetails) {

        const fileUrl = documentDetails.doc_path;
        const relativePath = fileUrl.replace(process.env.BASE_PATH, '');
        const oldFilePath = path.join(process.cwd(), 'public', relativePath);

        try {
            await fs.access(oldFilePath);
            await fs.unlink(oldFilePath);
            console.log('Old file deleted');
        } catch (error) {
            console.log('Old file not found or already deleted');
        }
    }

    async imageUpload(data) {
        // Save file information to database
        // Example using Prisma or any ORM:

        const fileRecord = await prisma.fileUpload.create({
            data: {
                fieldname: data.fieldname,
                originalname: data.originalname,
                modifiedname: data.modifiedname,
                mimetype: data.mimetype,
                size: data.size,
                contextId: data.contextId,
                websiteType: data.websiteType,
                localPath: data.localPath,
                url: data.url,
                uploadedAt: new Date()
            }
        });

        return {
            id: fileRecord.id,
            filename: data.modifiedname,
            url: data.url,
            size: data.size,
            mimetype: data.mimetype
        };
    }
}

export default new FileUploadService();