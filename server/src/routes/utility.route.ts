import express, { NextFunction, Response } from 'express';
import axios from 'axios';
import { errorHandler } from '../utils/error';
import SystemSettings from '../models/systemSettings.model';

const router = express.Router();

router.get('/ip-location', async (req, res: Response, next: NextFunction) => {
    try {
        const response = await axios.get('https://freeipapi.com/api/json');
        res.status(200).json(response.data);
    } catch (error) {
        next(errorHandler(500, 'Failed to fetch IP location.'));
    }
});

/**
 * @desc    Get commission rates for partners (public endpoint)
 * @route   GET /api/utility/commission-rates
 * @access  Public
 */
router.get('/commission-rates', async (req, res: Response, next: NextFunction) => {
    try {
        let settings = await SystemSettings.findOne();

        if (!settings) {
            return res.status(200).json({
                success: true,
                data: {
                    partnerCommissionRate: 0.8,
                    cancellationPenaltyRate: 0.05,
                },
            });
        }

        res.status(200).json({
            success: true,
            data: {
                partnerCommissionRate: settings.partnerCommissionRate,
                cancellationPenaltyRate: settings.cancellationPenaltyRate,
            },
        });
    } catch (error) {
        next(errorHandler(500, 'Failed to fetch commission rates.'));
    }
});

/**
 * @desc    Get CS2 news from Steam (proxy to avoid CORS)
 * @route   GET /api/v1/utils/cs2-news
 * @access  Public
 */
router.get('/cs2-news', async (req, res: Response, next: NextFunction) => {
    try {
        const response = await axios.get(
            'https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/',
            {
                params: {
                    appid: 730,
                    count: 6,
                },
            },
        );
        res.status(200).json(response.data);
    } catch (error) {
        next(errorHandler(500, 'Failed to fetch CS2 news.'));
    }
});

export default router;