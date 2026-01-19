import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    title: string;
    content: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

const announcementSchema = new Schema<IAnnouncement>(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
);

const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema);

export default Announcement;