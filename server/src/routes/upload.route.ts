import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const router = express.Router();

// config cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// config multer dùng memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
        files: 1,
    },
});

interface MulterRequest extends Request {
    file: Express.Multer.File;
}

// upload buffer lên cloudinary
const streamUpload = (fileBuffer: Buffer): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((err, result) => {
            if (result) resolve(result);
            else reject(err);
        });
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

router.post('/', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileReq = req as MulterRequest;

        if (!fileReq.file) {
            res.status(400).json({ error: 'No file uploaded' });
        }

        const result = await streamUpload(fileReq.file.buffer);
        res.status(201).json({ url: result.secure_url });
    } catch (error) {
        next(error);
    }
});

export default router;
