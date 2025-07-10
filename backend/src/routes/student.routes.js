import { Router } from 'express';

import {
    registerStudent,
    studentLogin,
    logoutStudent,
    refreshAccessToken,
    changeCurrentPassword,
    updateStudent,
    getStudentDetail,
    deleteStudent
} from '../controllers/studentController.js';

import {verifyJWT} from '../middlewares/student.middleware.js';

const router = Router();

// student
router.post('/register', registerStudent);
router.route('/login').post(studentLogin);
router.route('/logout').post(verifyJWT, logoutStudent);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/update').put(verifyJWT, updateStudent);
router.route('/detail/:id').get(verifyJWT, getStudentDetail);
router.route('/delete').delete(verifyJWT, deleteStudent);

export default router;
