import axios from "axios";
import { signOut } from "../redux/user/userSlice"; // Import the signOut action
import { store } from "../redux/store";

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: `${SERVER_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const axiosAuth = axios.create({
  baseURL: `${SERVER_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosAuth.interceptors.request.use(
  async (config) => {
    try {
      const { user } = store.getState();
      const ip = localStorage.getItem("ip_address");
      const response = await axiosInstance.post("/auth/refresh-token", {
        id: user.currentUser?._id,
        ip: ip,
      });
      if (response.status === 200) {
        config.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
        return config;
      } else {
        return Promise.reject("Refresh token failed");
      }
    } catch (error) {
      return new Promise((resolve, reject) => {
        store.dispatch(signOut());
        reject(error);
      });
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { axiosAuth, axiosInstance };
