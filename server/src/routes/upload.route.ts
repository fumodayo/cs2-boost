import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024, 
        files: 10, 
    },
});

interface MulterRequest extends Request {
    file: Express.Multer.File;
}

interface MulterMultipleRequest extends Request {
    files: Express.Multer.File[];
}

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
            return;
        }

        const result = await streamUpload(fileReq.file.buffer);
        res.status(201).json({ url: result.secure_url });
    } catch (error) {
        next(error);
    }
});

router.post(
    '/multiple',
    upload.array('files', 10),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const fileReq = req as MulterMultipleRequest;

            if (!fileReq.files || fileReq.files.length === 0) {
                res.status(400).json({ error: 'No files uploaded' });
                return;
            }

            const uploadPromises = fileReq.files.map((file) => streamUpload(file.buffer));
            const results = await Promise.all(uploadPromises);
            const urls = results.map((result) => result.secure_url);

            res.status(201).json({ urls });
        } catch (error) {
            next(error);
        }
    },
);

export default router;