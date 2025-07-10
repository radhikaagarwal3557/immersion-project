// controllers/assignmentController.js
const Assignment = require('../models/Assignment');

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const assignment = new Assignment({ title, description, dueDate });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
