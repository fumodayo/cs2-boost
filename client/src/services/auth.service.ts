import { axiosBase, axiosInstance, axiosPrivate } from "~/axiosAuth";
import {
  IUser,
  ILoginPayload,
  IRegisterPayload,
  IResetPasswordPayload,
  IGoogleAuthPayload,
  IAdminLoginPayload,
  ISignOutPayload,
  IRefreshTokenPayload,
  ISuccessResponse,
} from "~/types";

/**
 * @description Làm mới access token bằng refresh token.
 * @param payload - Dữ liệu chứa id người dùng và vị trí IP.
 * @returns - Thường không có data trả về, chỉ có cookie được set lại.
 */
const refreshToken = async (payload: IRefreshTokenPayload) => {
  return axiosBase.post("/auth/refresh-token", payload);
};

/**
 * @description Đăng ký một tài khoản người dùng mới.
 * @param payload - Dữ liệu đăng ký bao gồm email, password và thông tin thiết bị.
 * @returns {Promise<IUser>} - Đối tượng người dùng mới đã được tạo.
 */
const register = async (payload: IRegisterPayload): Promise<IUser> => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  return data.data;
};

/**
 * @description Đăng nhập vào hệ thống.
 * @param payload - Dữ liệu đăng nhập bao gồm identifier (email/username), password và thông tin thiết bị.
 * @returns {Promise<IUser>} - Đối tượng người dùng đã đăng nhập.
 */
const login = async (payload: ILoginPayload): Promise<IUser> => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data.data;
};

/**
 * @description Đăng nhập hoặc đăng ký bằng tài khoản Google.
 * @param payload - Thông tin từ Google và thông tin thiết bị.
 * @returns {Promise<IUser>} - Đối tượng người dùng đã đăng nhập hoặc được tạo mới.
 */
const authWithGmail = async (payload: IGoogleAuthPayload): Promise<IUser> => {
  const { data } = await axiosInstance.post("/auth/google", payload);
  return data.data;
};

/**
 * @description Gửi yêu cầu quên mật khẩu.
 * @param email_address - Email của người dùng cần đặt lại mật khẩu.
 * @returns {Promise<ISuccessResponse>} - Thông báo thành công.
 */
const forgotPassword = async (
  email_address: string,
): Promise<ISuccessResponse> => {
  const { data } = await axiosInstance.post("/auth/forgot-password", {
    email_address,
  });
  return data;
};

/**
 * @description Xác thực mã OTP.
 * @param otp - Mã OTP gồm 6 chữ số người dùng nhập.
 * @returns {Promise<ISuccessResponse>} - Thông báo xác thực thành công.
 */
const verifyOtp = async (otp: string): Promise<ISuccessResponse> => {
  const { data } = await axiosInstance.post("/auth/verify-otp", { otp });
  return data;
};

/**
 * @description Đặt lại mật khẩu sau khi đã xác thực OTP.
 * @param payload - Dữ liệu bao gồm email, mật khẩu mới và thông tin thiết bị.
 * @returns {Promise<IUser>} - Đối tượng người dùng sau khi đặt lại mật khẩu và tự động đăng nhập.
 */
const resetPassword = async (
  payload: IResetPasswordPayload,
): Promise<IUser> => {
  const { data } = await axiosInstance.post("/auth/reset-password", payload);
  return data.data;
};

/**
 * @description Đăng xuất khỏi hệ thống.
 * @param payload - Dữ liệu chứa id người dùng và vị trí IP để cập nhật trạng thái.
 * @returns {Promise<ISuccessResponse>} - Thông báo đăng xuất thành công.
 */
const signout = async (payload: ISignOutPayload): Promise<ISuccessResponse> => {
  const { data } = await axiosInstance.post("/auth/signout", payload);
  return data;
};

/**
 * @description Đăng xuất khỏi tất cả thiết bị.
 * @param id - Id người dùng.
 * @returns {Promise<ISuccessResponse>} - Thông báo đăng xuất thành công.
 */
const signoutAll = async (id: string): Promise<ISuccessResponse> => {
  const { data } = await axiosInstance.post("/auth/signout-all", { id });
  return data;
};

/**
 * @description Admin tạo một tài khoản mới.
 * @param payload - Dữ liệu đăng ký và vai trò của tài khoản.
 * @returns {Promise<IUser>} - Đối tượng người dùng mới.
 */
const registerWithAdmin = async (
  payload: IRegisterPayload & { role: string[] },
): Promise<IUser> => {
  const { data } = await axiosPrivate.post("/auth/admin/register", payload);
  return data.data;
};

/**
 * @description Đăng nhập vào trang quản trị.
 * @param payload - Tên đăng nhập và mật khẩu của admin.
 * @returns {Promise<IUser>} - Đối tượng người dùng admin.
 */
const loginWithAdmin = async (payload: IAdminLoginPayload): Promise<IUser> => {
  const { data } = await axiosInstance.post("/auth/admin/login", payload);
  return data.data;
};

export const authService = {
  refreshToken,
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
};
