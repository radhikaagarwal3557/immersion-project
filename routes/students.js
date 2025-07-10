const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middlewares/authMiddleware'); // import middleware

router.get('/', auth, studentController.getStudents);       // ✅ Protected
router.post('/', auth, studentController.createStudent);    // ✅ Protected
router.get('/:id', auth, studentController.getStudentById); // ✅ Protected

module.exports = router;
