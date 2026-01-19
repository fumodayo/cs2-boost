import mongoose from 'mongoose';
import { seedEmailTemplates } from '../seeds/emailTemplates.seed';

export const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        await seedEmailTemplates();
    } catch (e: any) {
        console.log('Could not connect to MongoDB', e.message);
    }
};