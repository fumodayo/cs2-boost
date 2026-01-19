import { NextFunction, Request, Response } from 'express';
import PremierRatesModel from '../models/premierRates.model';
import WingmanRatesModel from '../models/wingmanRates.model';
import { IRegionRates as IPremierRegionRates } from '../models/premierRates.model';
import { IRegionWingmanRates } from '../models/wingmanRates.model';
import { errorHandler } from '../utils/error';
import LevelFarmingModel from '../models/levelFarming.mode';

/**
 * @desc    Lấy toàn bộ cấu hình giá cho dịch vụ Premier.
 *          Bao gồm đơn giá cơ bản và bảng giá chi tiết cho từng khu vực.
 * @route   GET /api/rates/premier
 * @access  Public
 */
const getPremierRates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await PremierRatesModel.findOne();

        if (!config) {
            return next(
                errorHandler(404, 'Could not find the Premier price configuration document.'),
            );
        }

        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    (Admin) Cập nhật bảng giá chi tiết cho một khu vực cụ thể của Premier.
 *          Chỉ cập nhật mảng `rates` trong một document region con.
 * @route   PUT /api/rates/premier/regions/:regionValue
 * @access  Private (Admin)
 */
const updatePremierRatesForRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { regionValue } = req.params;
        const { rates }: { rates: IPremierRegionRates['rates'] } = req.body;

        if (!Array.isArray(rates)) {
            return next(errorHandler(400, 'The rates data is invalid.'));
        }

        const result = await PremierRatesModel.updateOne(
            { 'regions.value': regionValue },
            { $set: { 'regions.$.rates': rates } },
        );

        if (result.matchedCount === 0) {
            return next(
                errorHandler(404, `Could not find Premier region '${regionValue}' to update.`),
            );
        }

        res.status(200).json({
            success: true,
            message: `Premier prices for region ${regionValue} have been successfully updated.`,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    (Admin) Cập nhật các cấu hình chung cho dịch vụ Premier.
 *          Ví dụ: đơn giá cơ bản (`unitPrice`).
 * @route   PATCH /api/rates/premier/config
 * @access  Private (Admin)
 */
const updatePremierConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { unitPrice } = req.body;

        if (unitPrice === undefined) {
            return next(errorHandler(400, 'Please provide unitPrice data.'));
        }
        if (typeof unitPrice !== 'number' || unitPrice < 0) {
            return next(errorHandler(400, 'unitPrice must be a non-negative number.'));
        }

        const updatedConfig = await PremierRatesModel.findOneAndUpdate(
            {},
            { $set: { unitPrice } },
            { new: true, sort: { _id: 1 } },
        );

        if (!updatedConfig) {
            return next(errorHandler(404, 'Could not find Premier configuration to update.'));
        }

        res.status(200).json({
            success: true,
            message: 'The Premier configuration has been successfully updated.',
            data: { unitPrice: updatedConfig.unitPrice },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy toàn bộ cấu hình giá cho dịch vụ Wingman.
 *          Bao gồm đơn giá cơ bản và bảng giá chi tiết cho từng khu vực.
 * @route   GET /api/rates/wingman
 * @access  Public
 */
const getWingmanRates = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const config = await WingmanRatesModel.findOne();

        if (!config) {
            return next(
                errorHandler(404, 'Could not find the Wingman price configuration document.'),
            );
        }

        res.status(200).json({
            success: true,
            data: config,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    (Admin) Cập nhật bảng giá chi tiết cho một khu vực cụ thể của Wingman.
 *          Chỉ cập nhật mảng `rates` trong một document region con.
 * @route   PUT /api/rates/wingman/regions/:regionValue
 * @access  Private (Admin)
 */
const updateWingmanRatesForRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { regionValue } = req.params;
        const { rates }: { rates: IRegionWingmanRates['rates'] } = req.body;

        if (!Array.isArray(rates)) {
            return next(errorHandler(400, 'The rates data is invalid.'));
        }

        const result = await WingmanRatesModel.updateOne(
            { 'regions.value': regionValue },
            { $set: { 'regions.$.rates': rates } },
        );

        if (result.matchedCount === 0) {
            return next(
                errorHandler(404, `Could not find Wingman region '${regionValue}' to update.`),
            );
        }

        res.status(200).json({
            success: true,
            message: `Wingman prices for region ${regionValue} have been successfully updated.`,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    (Admin) Cập nhật các cấu hình chung cho dịch vụ Wingman.
 *          Ví dụ: đơn giá cơ bản (`unitPrice`).
 * @route   PATCH /api/rates/wingman/config
 * @access  Private (Admin)
 */
const updateWingmanConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { unitPrice } = req.body;

        if (unitPrice === undefined) {
            return next(errorHandler(400, 'Please provide unitPrice data.'));
        }
        if (typeof unitPrice !== 'number' || unitPrice < 0) {
            return next(errorHandler(400, 'unitPrice must be a non-negative number.'));
        }

        const updatedConfig = await WingmanRatesModel.findOneAndUpdate(
            {},
            { $set: { unitPrice } },
            { new: true, sort: { _id: 1 } },
        );

        if (!updatedConfig) {
            return next(errorHandler(404, 'Could not find Wingman configuration to update.'));
        }

        res.status(200).json({
            success: true,
            message: 'The Wingman configuration has been successfully updated.',
            data: { unitPrice: updatedConfig.unitPrice },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Lấy cấu hình giá cho dịch vụ Level Farming.
 *          Thường chỉ bao gồm một đơn giá (`unitPrice`) cho mỗi đơn vị EXP/Level.
 * @route   GET /api/rates/level-farming
 * @access  Public
 */
const getLevelFarmingConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await LevelFarmingModel.findOne();

        if (!data) {
            return next(
                errorHandler(404, 'Could not find the Level Farming price configuration document.'),
            );
        }

        res.status(200).json({
            success: true,
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    (Admin) Cập nhật cấu hình giá cho dịch vụ Level Farming.
 *          Sử dụng `upsert: true` để tự động tạo document nếu chưa tồn tại.
 * @route   PATCH /api/rates/level-farming/config
 * @access  Private (Admin)
 */
const updateLevelFarmingConfig = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { unitPrice } = req.body;

        if (unitPrice === undefined) {
            return next(errorHandler(400, 'Please provide unitPrice data.'));
        }
        if (typeof unitPrice !== 'number' || unitPrice < 0) {
            return next(errorHandler(400, 'unitPrice must be a non-negative number.'));
        }

        const updatedConfig = await LevelFarmingModel.findOneAndUpdate(
            {},
            { $set: { unitPrice } },
            { new: true, upsert: true },
        );

        res.status(200).json({
            success: true,
            message: 'The Level Farming configuration has been successfully updated.',
            data: updatedConfig,
        });
    } catch (error) {
        next(error);
    }
};

export {
    getPremierRates,
    updatePremierRatesForRegion,
    updatePremierConfig,
    getWingmanRates,
    updateWingmanRatesForRegion,
    updateWingmanConfig,
    getLevelFarmingConfig,
    updateLevelFarmingConfig,
};