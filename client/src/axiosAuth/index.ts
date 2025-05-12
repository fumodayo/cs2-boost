import axios from "axios";
import { store } from "~/redux/store";
import { signOut } from "~/redux/user/userSlice";
import { getLocalStorage } from "~/utils/localStorage";

const SERVER_URL = "http://localhost:5030";

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

const axiosAuth = axios.create({
  baseURL: `${SERVER_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosAuth.interceptors.request.use(
  async (config) => {
    try {
      const { user } = store.getState();
      if (!user.currentUser) return config;

      const ip_location = getLocalStorage("ip_location", "");
      const response = await axiosBase.post("/auth/refresh-token", {
        id: user.currentUser?._id,
        ip_location,
      });

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

axiosAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      console.log("response", { status, data });

      if (status === 401) {
        store.dispatch(signOut());
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
        store.dispatch(signOut());
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

export { axiosInstance, axiosAuth, axiosBase };
