import mongoose, {Schema} from 'mongoose';

const attendanceSchema = new Schema({
    student:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    subName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    },
}, {
    timestamps: true
})

const Attendance = mongoose.model('attendance', attendanceSchema);
export {Attendance};