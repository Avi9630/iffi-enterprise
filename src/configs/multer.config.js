import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError.js';

// ─── Storage ───────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
    }
});

// ─── Allowed MIME Types Map ─────────────────────────────────
export const MIME_TYPES = {
    IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
    PNG_ONLY: ['image/png'],
    PDF: ['application/pdf'],
    DOCX: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    PDF_DOCX: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    ALL_DOCS: [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
    ]
};


const createFileFilter = (allowedMimes) => (req, file, cb) => {
    if (!allowedMimes.includes(file.mimetype)) {
        return cb(
            new AppError(`Invalid file type for [${file.fieldname}]. Allowed: ${allowedMimes.join(', ')}`, 400),
            false
        );
    }
    cb(null, true);
};

export const createUpload = (allowedMimes = MIME_TYPES.ALL_DOCS, maxSizeMB = 5) => {
    return multer({
        storage,
        fileFilter: createFileFilter(allowedMimes),
        limits: { fileSize: maxSizeMB * 1024 * 1024 }
    });
};