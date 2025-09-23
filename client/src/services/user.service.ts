import { axiosInstance, axiosPrivate } from "~/axiosAuth";
import {
  IUser,
  IVerifyUserPayload,
  IUpdateUserPayload,
  IChangePasswordPayload,
  IPartnerQueryParams,
  IPaginatedResponse,
  ISuccessResponse,
  IDataSuccessResponse,
} from "~/types";

/**
 * @description Lấy thông tin công khai của một người dùng bằng ID.
 * @route   GET /api/users/:userId
 * @param   {string} userId - ID của người dùng cần lấy thông tin.
 * @returns {Promise<IUser>} - Đối tượng người dùng.
 */
const getUserById = async (userId: string): Promise<IUser> => {
  const { data } = await axiosInstance.get(`/users/${userId}`);
  return data.data;
};

/**
 * @description Lấy danh sách các Partner với bộ lọc và phân trang.
 * @route   GET /api/users/partners
 * @param   {IPartnerQueryParams} params - Các tham số để lọc và phân trang.
 * @returns {Promise<IPaginatedResponse<IUser>>} - Dữ liệu Partner đã được phân trang.
 */
const getPartners = async (
  params: IPartnerQueryParams,
): Promise<IPaginatedResponse<IUser>> => {
  const { data } = await axiosInstance.get("/users/partners", { params });
  return data;
};

/**
 * @description Lấy thông tin chi tiết của một Partner bằng username.
 * @route   GET /api/users/partner/:username
 * @param   {string} username - Tên người dùng của Partner.
 * @returns {Promise<IUser>} - Đối tượng Partner chi tiết.
 */
const getPartnerByUsername = async (username: string): Promise<IUser> => {
  const { data } = await axiosInstance.get(`/users/partner/${username}`);
  return data.data;
};

/**
 * @description Cập nhật thông tin cá nhân của người dùng đang đăng nhập.
 * @route   PATCH /api/users/me
 * @param   {IUpdateUserPayload} payload - Các trường thông tin cần cập nhật.
 * @returns {Promise<IUser>} - Đối tượng người dùng đã được cập nhật.
 */
const updateUser = async (payload: IUpdateUserPayload): Promise<IUser> => {
  const { data } = await axiosPrivate.patch(`/users/me`, payload);
  return data.data;
};

/**
 * @description Người dùng thay đổi mật khẩu của mình.
 * @route   POST /api/users/me/change-password
 * @param   {IChangePasswordPayload} payload - Mật khẩu cũ và mật khẩu mới.
 * @returns {Promise<ISuccessResponse>} - Phản hồi thông báo thành công.
 */
const changePassword = async (
  payload: IChangePasswordPayload,
): Promise<ISuccessResponse> => {
  const { data } = await axiosPrivate.post(
    `/users/me/change-password`,
    payload,
  );
  return data;
};

/**
 * @description Người dùng gửi thông tin để xác minh tài khoản và trở thành Partner.
 * @route   POST /api/users/me/verify
 * @param   {IVerifyUserPayload} payload - Thông tin cá nhân cần thiết để xác minh.
 * @returns {Promise<IUser>} - Đối tượng người dùng đã được cập nhật với vai trò Partner.
 */
const verifyUser = async (payload: IVerifyUserPayload): Promise<IUser> => {
  const { data } = await axiosPrivate.post(`/users/me/verify`, payload);
  return data.data;
};

/**
 * @description Người dùng theo dõi một Partner.
 * @route   POST /api/users/:partnerId/follow
 * @param   {string} partnerId - ID của Partner cần theo dõi.
 * @returns {Promise<IDataSuccessResponse<IUser>>} - Phản hồi thông báo thành công.
 */
const followPartner = async (
  partnerId: string,
): Promise<IDataSuccessResponse<IUser>> => {
  const { data } = await axiosPrivate.post(`/users/${partnerId}/follow`);
  return data;
};

/**
 * @description Người dùng bỏ theo dõi một Partner.
 * @route   POST /api/users/:partnerId/unfollow
 * @param   {string} partnerId - ID của Partner cần bỏ theo dõi.
 * @returns {Promise<IDataSuccessResponse<IUser>>} - Phản hồi thông báo thành công.
 */
const unfollowPartner = async (
  partnerId: string,
): Promise<IDataSuccessResponse<IUser>> => {
  const { data } = await axiosPrivate.post(`/users/${partnerId}/unfollow`);
  return data;
};

/**
 * @description (Admin) Tìm kiếm người dùng theo username hoặc full_name.
 * @route   GET /api/users/search
 * @param   {string} query - Từ khóa tìm kiếm.
 * @returns {Promise<IUser[]>} - Mảng các người dùng khớp với từ khóa.
 */
const searchUsers = async (query: string): Promise<IUser[]> => {
  const { data } = await axiosPrivate.get("/users/search", {
    params: { q: query },
  });
  return data.data;
};

export const userService = {
  getUserById,
  getPartners,
  getPartnerByUsername,
  updateUser,
  changePassword,
  verifyUser,
  followPartner,
  unfollowPartner,
  searchUsers,
};
