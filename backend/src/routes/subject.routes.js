import {Router} from "express";
import {
    createSubject,
    allSubjects,
    updateSubject,
    deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

// Create a new subject
router.post("/", createSubject);    
// Get all subjects
router.get("/", allSubjects);   
// Update a subject by ID
router.put("/:id", updateSubject);
// Delete a subject by ID
router.delete("/:id", deleteSubject);

export default router;