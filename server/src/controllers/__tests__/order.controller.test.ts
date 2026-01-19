import { Request, Response, NextFunction } from 'express';
import {
    getOrderById,
    createOrder,
    assignPartner,
    refuseOrder,
    deleteOrder,
    addAccountToOrder,
    editAccountOnOrder,
} from '../order.controller';
import Order from '../../models/order.model';
import Account from '../../models/account.model';
import User from '../../models/user.model';
import { AuthRequest } from '../../interfaces';

jest.mock('../../models/order.model');
jest.mock('../../models/account.model');
jest.mock('../../models/user.model');
jest.mock('../../models/notification.model');
jest.mock('../../models/conversation.model');
jest.mock('../../models/wallet.model');
jest.mock('../../models/transaction.model');
jest.mock('../../utils/generate', () => ({
    generateUserId: jest.fn().mockReturnValue('123456'),
}));
jest.mock('../../helpers', () => ({
    createNotification: jest.fn(),
    emitNotification: jest.fn(),
    emitOrderStatusChange: jest.fn(),
}));
jest.mock('../../helpers/order.helper', () => ({
    buildQueryOrderOptions: jest.fn().mockReturnValue({
        filters: {},
        sort: '-createdAt',
        page: 1,
        perPage: 15,
    }),
    orderPopulates: [],
}));
jest.mock('../../services/notification.service', () => ({
    notificationService: {
        createAndNotify: jest.fn().mockResolvedValue(true),
        broadcastNewOrder: jest.fn(),
        createPendingOrderNotification: jest.fn().mockResolvedValue(undefined),
        removePendingOrderNotificationIfEmpty: jest.fn().mockResolvedValue(undefined),
    },
}));
jest.mock('../../services/push.service', () => ({
    pushService: {
        triggerPushNotification: jest.fn().mockResolvedValue(true),
        triggerPushNotificationToMany: jest.fn().mockResolvedValue(true),
    },
}));

describe('Order Controller', () => {
    let mockReq: Partial<AuthRequest>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();
    });

    describe('getOrderById', () => {
        it('should return order when found', async () => {
            mockReq = { params: { boostId: 'BOOST123' } };
            const mockOrder = {
                _id: 'orderId123',
                boost_id: 'BOOST123',
                title: 'Premier Boost',
                price: 100000,
            };
            (Order.findOne as jest.Mock).mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockOrder),
            });

            await getOrderById(mockReq as Request, mockRes as Response, mockNext);

            expect(Order.findOne).toHaveBeenCalledWith({ boost_id: 'BOOST123' });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: mockOrder,
            });
        });

        it('should return 404 when order not found', async () => {
            mockReq = { params: { boostId: 'INVALID' } };
            (Order.findOne as jest.Mock).mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            });

            await getOrderById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'Order not found',
                }),
            );
        });

        it('should handle database error', async () => {
            mockReq = { params: { boostId: 'BOOST123' } };
            const dbError = new Error('Database error');
            (Order.findOne as jest.Mock).mockReturnValue({
                populate: jest.fn().mockRejectedValue(dbError),
            });

            await getOrderById(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(dbError);
        });
    });

    describe('createOrder', () => {
        it('should create order successfully', async () => {
            mockReq = {
                user: { id: 'userId123', role: ['client'] },
                body: {
                    title: 'Premier Boost',
                    type: 'premier',
                    price: 100000,
                },
            };
            const mockOrder = {
                _id: 'orderId123',
                boost_id: '123456',
                save: jest.fn().mockResolvedValue(true),
            };
            (Order as unknown as jest.Mock).mockImplementation(() => mockOrder);

            await createOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Order created successfully.',
                data: '123456',
            });
        });

        it('should include user id in order', async () => {
            mockReq = {
                user: { id: 'userId123', role: ['client'] },
                body: { title: 'Test Order' },
            };
            let capturedData: any;
            (Order as unknown as jest.Mock).mockImplementation((data) => {
                capturedData = data;
                return { save: jest.fn().mockResolvedValue(true), boost_id: '123456' };
            });

            await createOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(capturedData.user).toBe('userId123');
        });

        it('should handle save error', async () => {
            mockReq = {
                user: { id: 'userId123', role: ['client'] },
                body: { title: 'Test Order' },
            };
            const saveError = new Error('Save failed');
            (Order as unknown as jest.Mock).mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(saveError),
            }));

            await createOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(saveError);
        });
    });

    describe('assignPartner', () => {
        it('should assign partner successfully', async () => {
            mockReq = {
                params: { boostId: 'BOOST123' },
                body: { partnerId: 'partnerId456' },
                user: { id: 'userId123', role: ['client'] },
            };
            const mockOrder = {
                _id: 'orderId123',
                boost_id: 'BOOST123',
                save: jest.fn().mockResolvedValue(true),
            };
            (Order.findOneAndUpdate as jest.Mock).mockResolvedValue(mockOrder);

            await assignPartner(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(Order.findOneAndUpdate).toHaveBeenCalledWith(
                { boost_id: 'BOOST123', user: 'userId123' },
                { assign_partner: 'partnerId456' },
                { new: true },
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Partner successfully assigned to the order.',
            });
        });

        it('should return 404 when order not found', async () => {
            mockReq = {
                params: { boostId: 'INVALID' },
                body: { partnerId: 'partnerId456' },
                user: { id: 'userId123', role: ['client'] },
            };
            (Order.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            await assignPartner(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'Order not found.',
                }),
            );
        });
    });

    describe('refuseOrder', () => {
        it('should refuse order and reset to IN_ACTIVE', async () => {
            mockReq = {
                params: { boostId: 'BOOST123' },
                user: { id: 'userId123', role: ['client'] },
            };
            const mockOrder = {
                _id: 'orderId123',
                boost_id: 'BOOST123',
                title: 'Test Order',
                user: { toString: () => 'userId123' },
                assign_partner: { toString: () => 'partnerId456' },
                status: 'WAITING',
                save: jest.fn().mockResolvedValue(true),
            };
            (Order.findOne as jest.Mock).mockResolvedValue(mockOrder);
            (User.findById as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue({ username: 'testuser' }),
            });
            (User.find as jest.Mock).mockReturnValue({
                select: jest.fn().mockResolvedValue([]),
            });

            await refuseOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockOrder.assign_partner).toBeNull();
            expect(mockOrder.status).toBe('IN_ACTIVE');
            expect(mockRes.status).toHaveBeenCalledWith(201);
        });

        it('should return 404 when order not found', async () => {
            mockReq = {
                params: { boostId: 'INVALID' },
                user: { id: 'userId123', role: ['client'] },
            };
            (Order.findOne as jest.Mock).mockResolvedValue(null);

            await refuseOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'Order not found',
                }),
            );
        });

        it('should return 400 when order missing user field', async () => {
            mockReq = {
                params: { boostId: 'BOOST123' },
                user: { id: 'userId123', role: ['client'] },
            };
            const mockOrder = {
                boost_id: 'BOOST123',
                user: null,
            };
            (Order.findOne as jest.Mock).mockResolvedValue(mockOrder);

            await refuseOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Order missing user field',
                }),
            );
        });
    });

    describe('deleteOrder', () => {
        it('should delete order successfully', async () => {
            mockReq = {
                params: { boostId: 'BOOST123' },
                user: { id: 'userId123', role: ['client'] },
            };
            const mockOrder = {
                boost_id: 'BOOST123',
                user: { toString: () => 'userId123' },
            };
            (Order.findOne as jest.Mock).mockResolvedValue(mockOrder);
            (Order.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

            await deleteOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(Order.deleteOne).toHaveBeenCalledWith({ boost_id: 'BOOST123' });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Order deleted successfully',
            });
        });

        it('should return 404 when order not found', async () => {
            mockReq = {
                params: { boostId: 'INVALID' },
                user: { id: 'userId123', role: ['client'] },
            };
            (Order.findOne as jest.Mock).mockResolvedValue(null);

            await deleteOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'Order not found',
                }),
            );
        });

        it('should return 403 when user is not owner', async () => {
            mockReq = {
                params: { boostId: 'BOOST123' },
                user: { id: 'differentUser', role: ['client'] },
            };
            const mockOrder = {
                boost_id: 'BOOST123',
                user: { toString: () => 'userId123' },
            };
            (Order.findOne as jest.Mock).mockResolvedValue(mockOrder);

            await deleteOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 403,
                }),
            );
        });
    });

    describe('addAccountToOrder', () => {
        it('should add account to order successfully', async () => {
            mockReq = {
                params: { boostId: 'BOOST123' },
                user: { id: 'userId123', role: ['client'] },
                body: {
                    login: 'gameAccount',
                    password: 'gamePass123',
                    backup_code: 'BACKUP123',
                },
            };
            const mockAccount = {
                _id: 'accountId123',
                save: jest.fn().mockResolvedValue(true),
            };
            const mockOrder = { boost_id: 'BOOST123' };

            (Account as unknown as jest.Mock).mockImplementation(() => mockAccount);
            (Order.findOneAndUpdate as jest.Mock).mockResolvedValue(mockOrder);

            await addAccountToOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Account created and linked successfully',
                data: mockAccount,
            });
        });

        it('should return 400 when order update fails', async () => {
            mockReq = {
                params: { boostId: 'INVALID' },
                user: { id: 'userId123', role: ['client'] },
                body: { login: 'test', password: 'test' },
            };
            const mockAccount = {
                _id: 'accountId123',
                save: jest.fn().mockResolvedValue(true),
            };
            (Account as unknown as jest.Mock).mockImplementation(() => mockAccount);
            (Order.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

            await addAccountToOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Failed to link account to order',
                }),
            );
        });
    });

    describe('editAccountOnOrder', () => {
        it('should update account successfully', async () => {
            mockReq = {
                params: { accountId: 'accountId123' },
                user: { id: 'userId123', role: ['client'] },
                body: {
                    login: 'newLogin',
                    password: 'newPassword',
                    backup_code: 'newBackup',
                },
            };
            const mockAccount = {
                _id: 'accountId123',
                user_id: { toString: () => 'userId123' },
                login: 'oldLogin',
                password: 'oldPassword',
                save: jest.fn().mockImplementation(function (this: typeof mockAccount) {
                    return Promise.resolve(this);
                }),
            };
            (Account.findById as jest.Mock).mockResolvedValue(mockAccount);

            await editAccountOnOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message: 'Account updated successfully',
                data: expect.anything(),
            });
        });

        it('should return 404 when account not found', async () => {
            mockReq = {
                params: { accountId: 'invalidId' },
                user: { id: 'userId123', role: ['client'] },
                body: { login: 'test' },
            };
            (Account.findById as jest.Mock).mockResolvedValue(null);

            await editAccountOnOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'Account not found',
                }),
            );
        });

        it('should return 401 when user is not owner', async () => {
            mockReq = {
                params: { accountId: 'accountId123' },
                user: { id: 'differentUser', role: ['client'] },
                body: { login: 'test' },
            };
            const mockAccount = {
                _id: 'accountId123',
                user_id: { toString: () => 'userId123' },
            };
            (Account.findById as jest.Mock).mockResolvedValue(mockAccount);

            await editAccountOnOrder(mockReq as AuthRequest, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 401,
                }),
            );
        });
    });
});