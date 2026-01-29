import { model, Schema } from 'mongoose';
import { IMarquee } from './marquee.interface';

const marqueeSchema = new Schema<IMarquee>(
    {
        id: {
            type: String,
            required: [true, 'User ID is required'],
            unique: true,
        },
        messages: {
            type: [String],
            required: [true, 'Messages is required'],
        },
    },
    { timestamps: true },
);

export const Marquee = model<IMarquee>('Marquee', marqueeSchema);
