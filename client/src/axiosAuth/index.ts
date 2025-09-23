import axios from "axios";
import { store } from "~/redux/store";
import { signOut as userSignOut } from "~/redux/user/userSlice";
import { authService } from "~/services/auth.service";
import { getLocalStorage } from "~/utils/localStorage";

const SERVER_URL = "http://localhost:5040";

const axiosBase = axios.create({
  baseURL: `${SERVER_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const axiosPrivate = axios.create({
  baseURL: `${SERVER_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    try {
      const { user } = store.getState();
      if (!user.currentUser) return config;

      const payload = {
        id: user.currentUser?._id,
        ip_location: getLocalStorage("ip_location", ""),
      };
      const response = await authService.refreshToken(payload);
      if (response.status === 200) {
        config.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
      }
    } catch (error) {
      console.error("Failed to refresh token", error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      const originalRequestConfig = error.config;

      console.log("response error", {
        status,
        data,
        url: originalRequestConfig.url,
      });

      if (status === 401) {
        console.log("User session expired, signing out user...");
        store.dispatch(userSignOut());
      }

      return Promise.reject({
        success: false,
        message: data.message || "An error occurred",
        statusCode: status,
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || "Network error",
        statusCode: 500,
      });
    }
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      console.log({ status, data });

      if (status === 401) {
        store.dispatch(userSignOut());
      }

      return Promise.reject({
        success: false,
        message: data.message || "An error occurred",
        statusCode: status,
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || "Network error",
        statusCode: 500,
      });
    }
  },
);

export { axiosInstance, axiosBase, axiosPrivate };
