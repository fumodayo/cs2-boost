import { Response, NextFunction } from 'express';
import Subscription from '../models/subscription.model';
import { AuthRequest } from '../interfaces';
import { errorHandler } from '../utils/error';

const subscribe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const subscription = req.body;
    try {
        await Subscription.findOneAndUpdate(
            { user: req.user.id },
            { user: req.user.id, ...subscription },
            { upsert: true }, 
        );
        res.status(201).json({ message: 'Subscribed successfully' });
    } catch (e) {
        next(e);
    }
};

const unsubscribe = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await Subscription.deleteOne({ user: req.user.id });
        res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (e) {
        next(e);
    }
};

const getSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const sub = await Subscription.findOne({ user: req.user.id });
        if (sub) {
            res.status(200).json({
                isSubscribed: true,
                settings: sub.settings,
                vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
            });
        } else {
            res.status(200).json({
                isSubscribed: false,
                settings: {},
                vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
            });
        }
    } catch (e) {
        next(e);
    }
};

const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { settings } = req.body;
    try {
        const updatedSub = await Subscription.findOneAndUpdate(
            { user: req.user.id },
            { $set: { settings } },
            { new: true },
        );
        if (!updatedSub) return next(errorHandler(404, 'Subscription not found'));
        res.status(200).json({ settings: updatedSub.settings });
    } catch (e) {
        next(e);
    }
};

export { subscribe, unsubscribe, getSettings, updateSettings };