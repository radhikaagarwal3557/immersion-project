import { Router } from 'express';

import {
    createAttendance,
    getAllAttendance,
    singleAttendance,
    updateAttendance,
    deleteAttendance
} from '../controllers/attendanceController.js';

const router = Router();

// student
router.post("/", verifyJWT, createAttendance);
router.get("/", verifyJWT, getAllAttendance);
router.get("/:id", verifyJWT, singleAttendance);
router.put("/:id", verifyJWT, updateAttendance);
router.delete("/:id", verifyJWT, deleteAttendance);
export default router;
