import { Router } from 'express';
import { verifyJWT } from '../middlewares/verifyJWT.js'; 

import {
  adminRegister,
  adminLogin,
  adminLogout,
  refreshAdminAccessToken,
  changeAdminCurrentPassword, 
} from '../controllers/adminController.js';

const router = Router();

// Admin routes
router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogin);
router.post('/admin/logout', verifyJWT, adminLogout);
router.post('/admin/refresh-token', refreshAdminAccessToken);
router.post('/admin/change-password', verifyJWT, changeAdminCurrentPassword);

export default router;
