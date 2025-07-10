import mongoose, {Schema} from "mongoose";

const subjectSchema = new Schema(
    {
        subName: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
        },
        teacher:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher',
            required: true,
        },
        semester: {
            type: String,
            required: true,
        },
}, {timestamps: true});

export const Subject = mongoose.model('Subject', subjectSchema);