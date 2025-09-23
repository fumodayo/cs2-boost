import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
import axios from 'axios';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (imageUrl: string) => {
    try {
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                Accept: 'image/*',
            },
        });

        if (!response.data) {
            throw new Error('No image data received from URL');
        }

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'user_avatars' },
                (error, result) => {
                    if (error) {
                        console.error('Error uploading to Cloudinary:', error);
                        return reject(error);
                    }
                    resolve(result?.secure_url);
                },
            );

            streamifier.createReadStream(response.data).pipe(uploadStream);
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        return null;
    }
};

export { uploadToCloudinary };
