import express from 'express';
import { getUsers } from '../controllers/admin.controller';
import { verifyToken } from '../utils/verifyToken';

const router = express.Router();

router.post('/get-users', verifyToken, getUsers);

export default router;
