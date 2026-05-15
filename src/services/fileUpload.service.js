import documentReposotory from "../queries/document.reposotory.js";
import constant from "../constants/constant.js";
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

        const { websiteType, id: contextId, files } = payload;

        const uploadedFiles = [];

        for (const file of files) {

            const fieldName = file.fieldname.toUpperCase();
            const documentType = constant.DOCUMENT_TYPE[fieldName];

            if (documentType === undefined) {
                throw new AppError('Envalid document key.!', 422);
            }

            const fileDetails = await this.fileDetails(file);

            const criteria = {
                context_id: contextId,
                website_type: websiteType,
                document_type: documentType,
            };

            const documentDetails = await documentReposotory.checkExisting(criteria);
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
            const uploadResult = await documentReposotory.saveAndUpdate(criteria, fileData);
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


// class FileUploadService {
//     async upload(payload) {
//         const websiteType = payload.websiteType;
//         const contextId = payload.id;

//         const files = payload.files;

//         // console.log('Files to upload:', files);

//         const uploadedFiles = [];

//         for (const file of files) {

//             const originalName = file.originalname;
//             const fileName = path.parse(originalName).name;
//             const extension = path.extname(originalName);
//             const modifiedName = `${fileName}_${Date.now()}${extension}`;
//             const directory = path.join(
//                 __dirname,
//                 "..",
//                 "public/documents",
//                 payload.websiteType
//             );

//             console.log(originalName);
//             return;
//             try {
//                 const uploadResult = await this.imageUpload({
//                     file: file,
//                     fieldname: file.fieldname,
//                     originalname: file.originalname,
//                     mimetype: file.mimetype,
//                     buffer: file.buffer,
//                     size: file.size,
//                     contextId: contextId,
//                     websiteType: websiteType
//                 });
//                 uploadedFiles.push(uploadResult);
//             } catch (error) {
//                 console.error(`Error uploading ${file.fieldname}:`, error);
//                 throw error;
//             }
//         }

//         return uploadedFiles;
//     }

//     async saveToLocal(buffer, filename) {
//         const fs = require('fs').promises;
//         const path = require('path');

//         const uploadDir = path.join(__dirname, '../uploads');

//         // Ensure upload directory exists
//         try {
//             await fs.access(uploadDir);
//         } catch {
//             await fs.mkdir(uploadDir, { recursive: true });
//         }

//         const uniqueFilename = `${Date.now()}_${filename}`;
//         const filePath = path.join(uploadDir, uniqueFilename);

//         await fs.writeFile(filePath, buffer);

//         return {
//             url: `/uploads/${uniqueFilename}`,
//             path: filePath
//         };
//     }
// }

export default new FileUploadService();