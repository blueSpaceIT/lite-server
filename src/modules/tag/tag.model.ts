import { model, Schema } from 'mongoose';
import { ITag } from './tag.interface';

const tagSchema = new Schema<ITag>(
    {
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true },
);

// tag model
export const Tag = model<ITag>('Tag', tagSchema);
