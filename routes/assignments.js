const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middlewares/authMiddleware'); // import middleware

router.get('/', auth, assignmentController.getAssignments); 
router.post('/', auth, assignmentController.createAssignment); 

module.exports = router;
