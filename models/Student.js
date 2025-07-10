// models/Student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    class: { type: String, required: true },
    grades: [{ subject: String, score: Number }],
    attendance: [{ date: Date, present: Boolean }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);
