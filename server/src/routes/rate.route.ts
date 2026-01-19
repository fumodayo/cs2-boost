import express, { RequestHandler } from 'express';
import {
    getLevelFarmingConfig,
    getPremierRates,
    getWingmanRates,
    updateLevelFarmingConfig,
    updatePremierConfig,
    updatePremierRatesForRegion,
    updateWingmanConfig,
    updateWingmanRatesForRegion,
} from '../controllers/rate.controller';
import { authorize, protect } from '../middlewares/auth.middleware';
import { ROLE } from '../constants';

const router = express.Router();

router.get('/premier', getPremierRates as RequestHandler);
router.patch(
    '/premier/config',
    protect as RequestHandler,
    authorize(ROLE.ADMIN) as RequestHandler,
    updatePremierConfig as RequestHandler,
);
router.put(
    '/premier/regions/:regionValue',
    protect as RequestHandler,
    authorize(ROLE.ADMIN) as RequestHandler,
    updatePremierRatesForRegion as RequestHandler,
);

router.get('/wingman', getWingmanRates as RequestHandler);
router.patch(
    '/wingman/config',
    protect as RequestHandler,
    authorize(ROLE.ADMIN) as RequestHandler,
    updateWingmanConfig as RequestHandler,
);
router.put(
    '/wingman/regions/:regionValue',
    protect as RequestHandler,
    authorize(ROLE.ADMIN) as RequestHandler,
    updateWingmanRatesForRegion as RequestHandler,
);

router.get('/level-farming', getLevelFarmingConfig as RequestHandler);
router.patch(
    '/level-farming/config',
    protect as RequestHandler,
    authorize(ROLE.ADMIN) as RequestHandler,
    updateLevelFarmingConfig as RequestHandler,
);

export default router;