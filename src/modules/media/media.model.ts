import { model, Schema } from 'mongoose';
import { IMedia, IVideo } from './media.interface';

const videoSchema = new Schema<IVideo>({
    url: { type: String, required: true },
    type: { type: String, enum: ['video'], required: true },
    size: { type: Number },
});

export const VideoModel = model<IVideo>('Video', videoSchema);
// media schema
const mediaSchema = new Schema<IMedia>(
    {
        id: {
            type: String,
            required: [true, 'ID is required'],
            unique: true,
        },
        admin: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
        },
        student: {
            type: Schema.Types.ObjectId,
            ref: 'Student',
        },
        url: {
            type: String,
            required: [true, 'URL is required'],
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

// media model
export const Media = model<IMedia>('Media', mediaSchema);
