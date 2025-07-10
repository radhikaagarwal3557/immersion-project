// models/Assignment.js
const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    submissions: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        fileUrl: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', AssignmentSchema);
