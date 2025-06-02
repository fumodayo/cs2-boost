import { Request, Response, NextFunction } from 'express';

// TODO
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (e) {
        next(e);
    }
};

export { getUsers };
