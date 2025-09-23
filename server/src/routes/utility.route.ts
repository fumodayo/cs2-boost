import express, { NextFunction, Response } from 'express';
import axios from 'axios';
import { errorHandler } from '../utils/error';

const router = express.Router();

router.get('/ip-location', async (req, res: Response, next: NextFunction) => {
    try {
        const response = await axios.get('https://freeipapi.com/api/json');
        res.status(200).json(response.data);
    } catch (error) {
        next(errorHandler(500, 'Failed to fetch IP location.'));
    }
});

export default router;
