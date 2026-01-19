import { Request, Response, NextFunction } from 'express';
import {
    register,
    login,
    authWithGmail,
    forgotPassword,
    verifyOtp,
    resetPassword,
    signout,
    signoutAll,
    registerWithAdmin,
    loginWithAdmin,
    refreshToken,
} from '../auth.controller';
import User from '../../models/user.model';
import * as generateUtils from '../../utils/generate';
import * as emailUtils from '../../utils/sendEmail';
import bcryptjs from 'bcryptjs';

jest.mock('../../models/user.model');
jest.mock('../../utils/generate');
jest.mock('../../utils/sendEmail');
jest.mock('../../utils/uploadToCloudinary', () => ({
    uploadToCloudinary: jest.fn().mockResolvedValue('https://cloudinary.com/mock.jpg'),
}));
jest.mock('../../socket/socket', () => ({
    getReceiverSocketID: jest.fn(),
    io: { to: jest.fn().mockReturnThis(), emit: jest.fn() },
}));
jest.mock('../../helpers/token.helper', () => jest.fn().mockResolvedValue(undefined));

describe('Auth Controller', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            cookie: jest.fn().mockReturnThis(),
            clearCookie: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
        jest.clearAllMocks();

        (generateUtils.generateUsername as jest.Mock).mockReturnValue('test-123456');
        (generateUtils.generateUserId as jest.Mock).mockReturnValue('789012');
        (generateUtils.generatePassword as jest.Mock).mockReturnValue('GenPass123!');
        (generateUtils.generateAccessToken as jest.Mock).mockImplementation(() => {});
        (generateUtils.generateRefreshToken as jest.Mock).mockImplementation(() => {});
        (emailUtils.sendEmail as jest.Mock).mockResolvedValue(true);
    });

    describe('register', () => {
        const validData = {
            email_address: 'test@example.com',
            password: 'Password123!',
            ip_location: '192.168.1.1',
            country: 'Vietnam',
            device: 'Chrome/Windows',
        };

        const createMockUser = () => ({
            _id: 'userId123',
            username: 'test-123456',
            user_id: '789012',
            email_address: 'test@example.com',
            password: 'hashedPassword',
            ip_addresses: [
                { ip_location: '192.168.1.1', country: 'Vietnam', device: 'Chrome/Windows' },
            ],
            toObject: jest.fn().mockReturnValue({
                _id: 'userId123',
                username: 'test-123456',
                user_id: '789012',
                email_address: 'test@example.com',
                password: 'hashedPassword',
            }),
        });

        it('should register successfully with valid data', async () => {
            mockReq = { body: validData };
            const mockUser = createMockUser();
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User as unknown as jest.Mock).mockImplementation(() => ({
                ...mockUser,
                save: jest.fn().mockResolvedValue(mockUser),
            }));

            await register(mockReq as Request, mockRes as Response, mockNext);

            expect(User.findOne).toHaveBeenCalledWith({ email_address: validData.email_address });
            expect(generateUtils.generateUsername).toHaveBeenCalledWith(validData.email_address);
            expect(generateUtils.generateUserId).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Register is completed',
                }),
            );
        });

        it('should generate access and refresh tokens on success', async () => {
            mockReq = { body: validData };
            const mockUser = createMockUser();
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User as unknown as jest.Mock).mockImplementation(() => ({
                ...mockUser,
                save: jest.fn().mockResolvedValue(mockUser),
            }));

            await register(mockReq as Request, mockRes as Response, mockNext);

            expect(generateUtils.generateAccessToken).toHaveBeenCalledWith(mockRes, mockUser);
            expect(generateUtils.generateRefreshToken).toHaveBeenCalledWith(mockRes, mockUser);
        });

        it('should return 400 when ip_location is missing', async () => {
            mockReq = { body: { ...validData, ip_location: undefined } };

            await register(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Please turn off your VPN',
                }),
            );
            expect(User.findOne).not.toHaveBeenCalled();
        });

        it('should return 400 when country is missing', async () => {
            mockReq = { body: { ...validData, country: undefined } };

            await register(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Please turn off your VPN',
                }),
            );
        });

        it('should return 400 when device is missing', async () => {
            mockReq = { body: { ...validData, device: undefined } };

            await register(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Please turn off your VPN',
                }),
            );
        });

        it('should return 400 when email already exists', async () => {
            mockReq = { body: validData };
            (User.findOne as jest.Mock).mockResolvedValue({ email_address: 'test@example.com' });

            await register(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Email address has taken',
                }),
            );
        });

        it('should not return password in response data', async () => {
            mockReq = { body: validData };
            const mockUser = createMockUser();
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User as unknown as jest.Mock).mockImplementation(() => ({
                ...mockUser,
                save: jest.fn().mockResolvedValue(mockUser),
            }));

            await register(mockReq as Request, mockRes as Response, mockNext);

            const responseData = (mockRes.json as jest.Mock).mock.calls[0][0].data;
            expect(responseData.password).toBeUndefined();
        });

        it('should handle database error gracefully', async () => {
            mockReq = { body: validData };
            const dbError = new Error('Database connection failed');
            (User.findOne as jest.Mock).mockRejectedValue(dbError);

            await register(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(dbError);
        });

        it('should handle save error gracefully', async () => {
            mockReq = { body: validData };
            const saveError = new Error('Failed to save user');
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User as unknown as jest.Mock).mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(saveError),
            }));

            await register(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(saveError);
        });
    });

    describe('login', () => {
        const loginData = {
            identifier: 'test@example.com',
            password: 'Password123!',
            ip_location: '192.168.1.1',
            country: 'Vietnam',
            device: 'Chrome/Windows',
        };

        const createMockUser = (overrides = {}) => {
            const hashedPassword = bcryptjs.hashSync('Password123!', 10);
            const user = {
                _id: 'userId123',
                email_address: 'test@example.com',
                password: hashedPassword,
                role: ['client'],
                ip_addresses: [] as { ip_location: string; status: string }[],
                save: jest.fn(),
                toObject: jest.fn().mockReturnValue({
                    _id: 'userId123',
                    email_address: 'test@example.com',
                    password: hashedPassword,
                }),
                ...overrides,
            };
            user.save = jest.fn().mockImplementation(function (this: typeof user) {
                return Promise.resolve(this);
            });
            return user;
        };

        it('should login successfully with email', async () => {
            mockReq = { body: loginData };
            const mockUser = createMockUser();
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Login is successfully.',
                }),
            );
        });

        it('should login successfully with username', async () => {
            mockReq = { body: { ...loginData, identifier: 'testuser' } };
            const mockUser = createMockUser();
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(User.findOne).toHaveBeenCalledWith({
                $or: [{ email_address: 'testuser' }, { username: 'testuser' }],
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should add new IP to ip_addresses when logging from new location', async () => {
            mockReq = { body: loginData };
            const mockUser = createMockUser({ ip_addresses: [] });
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.ip_addresses).toContainEqual(
                expect.objectContaining({
                    ip_location: '192.168.1.1',
                    country: 'Vietnam',
                    device: 'Chrome/Windows',
                }),
            );
        });

        it('should update existing IP status to ONLINE', async () => {
            mockReq = { body: loginData };
            const mockUser = createMockUser({
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'OFFLINE' }],
            });
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.ip_addresses[0].status).toBe('ONLINE');
        });

        it('should return 400 when user not found', async () => {
            mockReq = { body: loginData };
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Wrong email address or password',
                }),
            );
        });

        it('should return 400 with wrong password', async () => {
            mockReq = { body: loginData };
            const mockUser = createMockUser();
            mockUser.password = bcryptjs.hashSync('WrongPassword!', 10);
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Wrong email address or password',
                }),
            );
        });

        it('should return 403 when admin tries to login via user route', async () => {
            mockReq = { body: loginData };
            const mockUser = createMockUser({ role: ['admin'] });
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 403,
                    message: 'Admin accounts cannot log in here.',
                }),
            );
        });

        it('should return 400 when VPN data is missing', async () => {
            mockReq = { body: { identifier: 'test@example.com', password: 'Pass123!' } };

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Please turn off your VPN',
                }),
            );
        });

        it('should generate tokens on successful login', async () => {
            mockReq = { body: loginData };
            const mockUser = createMockUser();
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockReq as Request, mockRes as Response, mockNext);

            expect(generateUtils.generateAccessToken).toHaveBeenCalled();
            expect(generateUtils.generateRefreshToken).toHaveBeenCalled();
        });

        it('should not return password in response', async () => {
            mockReq = { body: loginData };
            const mockUser = createMockUser();
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await login(mockReq as Request, mockRes as Response, mockNext);

            const responseData = (mockRes.json as jest.Mock).mock.calls[0][0].data;
            expect(responseData.password).toBeUndefined();
        });
    });

    describe('authWithGmail', () => {
        const googleData = {
            username: 'googleuser',
            email_address: 'google@example.com',
            profile_picture: 'https://google.com/avatar.jpg',
            ip_location: '192.168.1.1',
            country: 'Vietnam',
            device: 'Chrome/Windows',
        };

        it('should login existing Google user', async () => {
            mockReq = { body: googleData };
            const mockUser = {
                _id: 'userId123',
                email_address: 'google@example.com',
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'OFFLINE' }],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({
                    _id: 'userId123',
                    email_address: 'google@example.com',
                    password: 'hashedPass',
                }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await authWithGmail(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Login is successfully.',
                }),
            );
        });

        it('should update existing IP status to ONLINE for returning user', async () => {
            mockReq = { body: googleData };
            const mockUser = {
                _id: 'userId123',
                email_address: 'google@example.com',
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'OFFLINE' }],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ password: 'hashed' }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await authWithGmail(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.ip_addresses[0].status).toBe('ONLINE');
        });

        it('should add new IP for existing user from new location', async () => {
            mockReq = { body: googleData };
            const mockUser = {
                _id: 'userId123',
                email_address: 'google@example.com',
                ip_addresses: [{ ip_location: '10.0.0.1', status: 'ONLINE' }],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ password: 'hashed' }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await authWithGmail(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.ip_addresses.length).toBe(2);
        });

        it('should create new user for first-time Google login', async () => {
            mockReq = { body: googleData };
            const mockNewUser = {
                _id: 'newUserId',
                email_address: 'google@example.com',
                save: jest.fn().mockImplementation(function (this: typeof mockNewUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({
                    _id: 'newUserId',
                    email_address: 'google@example.com',
                    password: 'generatedPass',
                }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User as unknown as jest.Mock).mockImplementation(() => mockNewUser);

            await authWithGmail(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
        });

        it('should send password email to new Google user', async () => {
            mockReq = { body: googleData };
            const mockNewUser = {
                save: jest.fn().mockImplementation(function (this: typeof mockNewUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ password: 'hashed' }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(null);
            (User as unknown as jest.Mock).mockImplementation(() => mockNewUser);

            await authWithGmail(mockReq as Request, mockRes as Response, mockNext);

            expect(emailUtils.sendEmail).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: googleData.email_address,
                    subject: 'Your New Password',
                }),
            );
        });

        it('should return 400 when VPN data is missing', async () => {
            mockReq = { body: { username: 'googleuser', email_address: 'google@example.com' } };

            await authWithGmail(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Please turn off your VPN',
                }),
            );
        });

        it('should not return password in response', async () => {
            mockReq = { body: googleData };
            const mockUser = {
                _id: 'userId123',
                email_address: 'google@example.com',
                profile_picture: 'https://example.com/pic.jpg',
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'OFFLINE' }],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({
                    _id: 'userId123',
                    email_address: 'google@example.com',
                    password: 'shouldBeRemoved',
                }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await authWithGmail(mockReq as Request, mockRes as Response, mockNext);

            const responseData = (mockRes.json as jest.Mock).mock.calls[0][0].data;
            expect(responseData.password).toBeUndefined();
        });
    });

    describe('refreshToken', () => {
        it('should return 401 when no refresh token in cookies', async () => {
            mockReq = {
                cookies: {},
                body: { id: 'userId123', ip_location: '192.168.1.1' },
            };
            const mockUser = {
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'ONLINE' }],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await refreshToken(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 401,
                    message: 'Unauthorized',
                }),
            );
        });

        it('should set IP status to OFFLINE when no refresh token', async () => {
            mockReq = {
                cookies: {},
                body: { id: 'userId123', ip_location: '192.168.1.1' },
            };
            const mockUser = {
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'ONLINE' }],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await refreshToken(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.ip_addresses[0].status).toBe('OFFLINE');
            expect(mockUser.save).toHaveBeenCalled();
        });
    });

    describe('forgotPassword', () => {
        it('should send OTP email successfully', async () => {
            mockReq = { body: { email_address: 'test@example.com' } };
            const mockUser = {
                email_address: 'test@example.com',
                otp: null,
                otp_expiry: null,
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await forgotPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(emailUtils.sendEmail).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'An OTP code has been sent to your email.',
                }),
            );
        });

        it('should set OTP and expiry on user', async () => {
            mockReq = { body: { email_address: 'test@example.com' } };
            const mockUser = {
                email_address: 'test@example.com',
                otp: null as string | null,
                otp_expiry: null as number | null,
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await forgotPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.otp).toBeDefined();
            expect(mockUser.otp).toHaveLength(6);
            expect(mockUser.otp_expiry).toBeGreaterThan(Date.now());
        });

        it('should return 404 when user not found', async () => {
            mockReq = { body: { email_address: 'notfound@example.com' } };
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await forgotPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'User not found',
                }),
            );
        });

        it('should handle email sending error', async () => {
            mockReq = { body: { email_address: 'test@example.com' } };
            const mockUser = { save: jest.fn().mockResolvedValue(true) };
            const emailError = new Error('Email service failed');
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);
            (emailUtils.sendEmail as jest.Mock).mockRejectedValue(emailError);

            await forgotPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(emailError);
        });
    });

    describe('verifyOtp', () => {
        it('should verify valid OTP successfully', async () => {
            mockReq = { body: { otp: '123456' } };
            const mockUser = {
                otp: '123456',
                otp_expiry: Date.now() + 3600000,
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await verifyOtp(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: true, message: 'OTP correct' });
        });

        it('should clear OTP after successful verification', async () => {
            mockReq = { body: { otp: '123456' } };
            const mockUser = {
                otp: '123456' as string | null,
                otp_expiry: (Date.now() + 3600000) as number | null,
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await verifyOtp(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.otp).toBeNull();
            expect(mockUser.otp_expiry).toBeNull();
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('should return 400 for invalid OTP', async () => {
            mockReq = { body: { otp: 'invalid' } };
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await verifyOtp(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'OTP Invalid or has been expired',
                }),
            );
        });

        it('should return 400 for expired OTP', async () => {
            mockReq = { body: { otp: '123456' } };

            (User.findOne as jest.Mock).mockResolvedValue(null);

            await verifyOtp(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'OTP Invalid or has been expired',
                }),
            );
        });
    });

    describe('resetPassword', () => {
        const resetData = {
            email_address: 'test@example.com',
            new_password: 'NewPass123!',
            ip_location: '192.168.1.1',
            country: 'Vietnam',
            device: 'Chrome/Windows',
        };

        it('should reset password successfully', async () => {
            mockReq = { body: resetData };
            const mockUser = {
                email_address: 'test@example.com',
                password: 'oldPassword',
                otp: '123456' as string | null,
                otp_expiry: Date.now() as number | null,
                ip_addresses: [] as { ip_location: string; status?: string }[],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ _id: 'userId123', password: 'hashed' }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await resetPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Password was reset successfully.',
                }),
            );
        });

        it('should update password on user', async () => {
            mockReq = { body: resetData };
            const mockUser = {
                password: 'oldPassword',
                otp: '123456' as string | null,
                otp_expiry: Date.now() as number | null,
                ip_addresses: [],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ password: 'hashed' }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await resetPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.password).toBe(resetData.new_password);
        });

        it('should clear OTP after password reset', async () => {
            mockReq = { body: resetData };
            const mockUser = {
                password: 'oldPassword',
                otp: '123456' as string | null,
                otp_expiry: Date.now() as number | null,
                ip_addresses: [],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ password: 'hashed' }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await resetPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.otp).toBeNull();
            expect(mockUser.otp_expiry).toBeNull();
        });

        it('should add new IP address on reset', async () => {
            mockReq = { body: resetData };
            const mockUser = {
                password: 'oldPassword',
                ip_addresses: [] as { ip_location: string }[],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ password: 'hashed' }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await resetPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.ip_addresses).toContainEqual(
                expect.objectContaining({
                    ip_location: '192.168.1.1',
                }),
            );
        });

        it('should return 400 when user not found', async () => {
            mockReq = { body: resetData };
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await resetPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Invalid or expired OTP',
                }),
            );
        });

        it('should return 400 when VPN data is missing', async () => {
            mockReq = { body: { email_address: 'test@example.com', new_password: 'NewPass!' } };

            await resetPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Please turn off your VPN',
                }),
            );
        });

        it('should generate tokens after password reset', async () => {
            mockReq = { body: resetData };
            const mockUser = {
                password: 'oldPassword',
                ip_addresses: [],
                save: jest.fn().mockImplementation(function (this: typeof mockUser) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ password: 'hashed' }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            await resetPassword(mockReq as Request, mockRes as Response, mockNext);

            expect(generateUtils.generateAccessToken).toHaveBeenCalled();
            expect(generateUtils.generateRefreshToken).toHaveBeenCalled();
        });
    });

    describe('signout', () => {
        it('should signout successfully', async () => {
            mockReq = { body: { id: 'userId123', ip_location: '192.168.1.1' } };
            const mockUser = {
                _id: 'userId123',
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'ONLINE' }],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await signout(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.clearCookie).toHaveBeenCalledWith('access_token');
            expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Signout success',
                }),
            );
        });

        it('should set IP status to OFFLINE', async () => {
            mockReq = { body: { id: 'userId123', ip_location: '192.168.1.1' } };
            const mockUser = {
                _id: 'userId123',
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'ONLINE' }],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await signout(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.ip_addresses[0].status).toBe('OFFLINE');
        });

        it('should return 404 when user not found', async () => {
            mockReq = { body: { id: 'invalidId', ip_location: '192.168.1.1' } };
            (User.findById as jest.Mock).mockResolvedValue(null);

            await signout(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'User not found',
                }),
            );
        });

        it('should handle multiple IPs correctly', async () => {
            mockReq = { body: { id: 'userId123', ip_location: '192.168.1.1' } };
            const mockUser = {
                _id: 'userId123',
                ip_addresses: [
                    { ip_location: '192.168.1.1', status: 'ONLINE' },
                    { ip_location: '10.0.0.1', status: 'ONLINE' },
                ],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await signout(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.ip_addresses[0].status).toBe('OFFLINE');
            expect(mockUser.ip_addresses[1].status).toBe('ONLINE');
        });
    });

    describe('signoutAll', () => {
        it('should signout all devices and increment token version', async () => {
            mockReq = { body: { id: 'userId123' } };
            const mockUser = {
                _id: 'userId123',
                token_version: 0,
                ip_addresses: [
                    { ip_location: '192.168.1.1', status: 'ONLINE' },
                    { ip_location: '192.168.1.2', status: 'ONLINE' },
                ],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await signoutAll(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.token_version).toBe(1);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Signout all devices success',
                }),
            );
        });

        it('should set all IPs to OFFLINE', async () => {
            mockReq = { body: { id: 'userId123' } };
            const mockUser = {
                _id: 'userId123',
                token_version: 0,
                ip_addresses: [
                    { ip_location: '192.168.1.1', status: 'ONLINE' },
                    { ip_location: '192.168.1.2', status: 'ONLINE' },
                    { ip_location: '10.0.0.1', status: 'ONLINE' },
                ],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await signoutAll(mockReq as Request, mockRes as Response, mockNext);

            mockUser.ip_addresses.forEach((ip) => {
                expect(ip.status).toBe('OFFLINE');
            });
        });

        it('should clear cookies', async () => {
            mockReq = { body: { id: 'userId123' } };
            const mockUser = {
                _id: 'userId123',
                token_version: 0,
                ip_addresses: [{ ip_location: '192.168.1.1', status: 'ONLINE' }],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await signoutAll(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.clearCookie).toHaveBeenCalledWith('access_token');
            expect(mockRes.clearCookie).toHaveBeenCalledWith('refresh_token');
        });

        it('should return 404 when user not found', async () => {
            mockReq = { body: { id: 'invalidId' } };
            (User.findById as jest.Mock).mockResolvedValue(null);

            await signoutAll(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 404,
                    message: 'User not found',
                }),
            );
        });

        it('should handle undefined token_version', async () => {
            mockReq = { body: { id: 'userId123' } };
            const mockUser = {
                token_version: undefined as number | undefined,
                ip_addresses: [],
                save: jest.fn().mockResolvedValue(true),
            };
            (User.findById as jest.Mock).mockResolvedValue(mockUser);

            await signoutAll(mockReq as Request, mockRes as Response, mockNext);

            expect(mockUser.token_version).toBe(1);
        });
    });

    describe('registerWithAdmin', () => {
        const adminData = {
            username: 'newadmin',
            email_address: 'admin@example.com',
            password: 'AdminPass123!',
            role: ['admin'],
        };

        it('should register admin successfully', async () => {
            mockReq = { body: adminData };
            const mockAdmin = {
                _id: 'adminId123',
                username: 'newadmin',
                email_address: 'admin@example.com',
                role: ['admin'],
                save: jest.fn().mockImplementation(function (this: typeof mockAdmin) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({
                    _id: 'adminId123',
                    username: 'newadmin',
                    email_address: 'admin@example.com',
                    password: 'hashedPass',
                    role: ['admin'],
                }),
            };
            (User as unknown as jest.Mock).mockImplementation(() => mockAdmin);

            await registerWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Account created successfully.',
                }),
            );
        });

        it('should not return password in response', async () => {
            mockReq = { body: adminData };
            const mockAdmin = {
                save: jest.fn().mockImplementation(function (this: typeof mockAdmin) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({
                    _id: 'adminId123',
                    password: 'shouldBeRemoved',
                }),
            };
            (User as unknown as jest.Mock).mockImplementation(() => mockAdmin);

            await registerWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            const responseData = (mockRes.json as jest.Mock).mock.calls[0][0].data;
            expect(responseData.password).toBeUndefined();
        });

        it('should handle database error', async () => {
            mockReq = { body: adminData };
            const saveError = new Error('Database error');
            (User as unknown as jest.Mock).mockImplementation(() => ({
                save: jest.fn().mockRejectedValue(saveError),
            }));

            await registerWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(saveError);
        });
    });

    describe('loginWithAdmin', () => {
        it('should login admin successfully', async () => {
            mockReq = { body: { username: 'admin', password: 'AdminPass123!' } };
            const hashedPassword = bcryptjs.hashSync('AdminPass123!', 10);
            const mockAdmin = {
                _id: 'adminId123',
                username: 'admin',
                password: hashedPassword,
                role: ['admin'],
                save: jest.fn().mockImplementation(function (this: typeof mockAdmin) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({
                    _id: 'adminId123',
                    username: 'admin',
                    password: hashedPassword,
                    role: ['admin'],
                }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockAdmin);

            await loginWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    message: 'Admin login successful.',
                }),
            );
        });

        it('should generate tokens on successful admin login', async () => {
            mockReq = { body: { username: 'admin', password: 'AdminPass123!' } };
            const hashedPassword = bcryptjs.hashSync('AdminPass123!', 10);
            const mockAdmin = {
                password: hashedPassword,
                role: ['admin'],
                save: jest.fn().mockImplementation(function (this: typeof mockAdmin) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({ password: hashedPassword }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockAdmin);

            await loginWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            expect(generateUtils.generateAccessToken).toHaveBeenCalled();
            expect(generateUtils.generateRefreshToken).toHaveBeenCalled();
        });

        it('should return 400 when admin not found', async () => {
            mockReq = { body: { username: 'admin', password: 'AdminPass123!' } };
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await loginWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Wrong email address or password',
                }),
            );
        });

        it('should return 400 with wrong password', async () => {
            mockReq = { body: { username: 'admin', password: 'WrongPass!' } };
            const mockAdmin = {
                password: bcryptjs.hashSync('CorrectPass!', 10),
                role: ['admin'],
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockAdmin);

            await loginWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            expect(mockNext).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: 400,
                    message: 'Wrong email address or password',
                }),
            );
        });

        it('should query with admin role filter', async () => {
            mockReq = { body: { username: 'admin', password: 'AdminPass123!' } };
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await loginWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            expect(User.findOne).toHaveBeenCalledWith({
                username: 'admin',
                role: 'admin',
            });
        });

        it('should not return password in response', async () => {
            mockReq = { body: { username: 'admin', password: 'AdminPass123!' } };
            const hashedPassword = bcryptjs.hashSync('AdminPass123!', 10);
            const mockAdmin = {
                password: hashedPassword,
                role: ['admin'],
                save: jest.fn().mockImplementation(function (this: typeof mockAdmin) {
                    return Promise.resolve(this);
                }),
                toObject: jest.fn().mockReturnValue({
                    _id: 'adminId123',
                    password: hashedPassword,
                }),
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockAdmin);

            await loginWithAdmin(mockReq as Request, mockRes as Response, mockNext);

            const responseData = (mockRes.json as jest.Mock).mock.calls[0][0].data;
            expect(responseData.password).toBeUndefined();
        });
    });
});