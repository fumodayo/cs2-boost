import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { IP_STATUS } from "../constants/index.js";

const expiredAccessToken = 15 * 60 * 1000; // 15 minutes
const expiredRefreshToken = 7 * 24 * 24 * 60 * 1000; // 7 days

export const refreshToken = async (req, res, next) => {
  const { refresh_token } = req.cookies;
  const { id, ip } = req.body;

  if (!refresh_token) {
    const validUser = await User.findById(id);
    if (!validUser) return next(errorHandler(404, "User not found"));

    validUser.ip_logger.forEach((log) => {
      if (log.ip === ip) {
        log.status = IP_STATUS.OFFLINE;
      }
    });

    await validUser.save();

    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    const payload = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);
    const validUser = await User.findById(payload.id);

    if (!validUser) {
      return next(errorHandler(401, "Unauthorized"));
    }

    // Create new access token
    const newAccessToken = jwt.sign(
      { id: validUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

/*
 * SIGNUP
 * 1. CHECK EXISTS USER IN DATABASE
 * 2. CREATE USER
 * 3. PUSH NEW IP INTO USER
 */
export const signup = async (req, res, next) => {
  const { email, password, ip, country } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(errorHandler(400, "This email is already taken"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      // Example: fumodayo1701@gmail.com -> fumodayo-1701-2788
      username:
        email.split("@")[0].replace(/\d+/g, (match) => "-" + match) +
        "-" +
        Math.floor(Math.random() * 10000).toString(),
      user_id: Math.floor(Math.random() * 1000000).toString(),
      email,
      password: hashedPassword,
    });

    newUser.ip_logger.push({ ip, country });

    const validUser = await newUser.save();

    const accessToken = jwt.sign(
      { id: validUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: validUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const { password: userPassword, ...rest } = validUser._doc;

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: expiredAccessToken,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: expiredRefreshToken,
    });

    res.status(200).json({ user: rest });
  } catch (error) {
    next(error);
  }
};

/*
 * LOGIN
 * 1. CHECK EXISTS USER IN DATABASE
 * 2. CHECK IP:
 * - IF IP OLD, CHANGE IP STATUS: OFFLINE -> ONLINE
 * - IF IP NEW, PUSH INTO USER
 */
export const signin = async (req, res, next) => {
  const { email, password, ip, country } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));

    let isNewIP = true;

    // Check if the IP is already in the ip_logger array
    validUser.ip_logger.forEach((log) => {
      if (log.ip === ip) {
        isNewIP = false;
        log.status = IP_STATUS.ONLINE; // Set status to online for existing IP
      }
    });

    if (isNewIP) {
      // If IP is not present, add it to the ip_logger array
      validUser.ip_logger.push({
        ip: ip,
        country: country,
        status: IP_STATUS.ONLINE,
      });
    }

    await validUser.save();

    const accessToken = jwt.sign(
      { id: validUser._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { id: validUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const { password: hashedPassword, ...rest } = validUser._doc;

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: expiredAccessToken,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: expiredRefreshToken,
    });

    res.status(200).json({ user: rest });
  } catch (error) {
    next(error);
  }
};

/*
 * SIGNUP/ LOGIN BY GOOGLE ACCOUNT
 * 1. CHECK EXISTS USER IN DATABASE:
 * - IF HAVE USER: LOGIN
 * - IF DONT HAVE USER: SIGNUP
 * 2. LOGIN:
 * - CHECK EXISTS USER IN DATABASE
 * - CHECK IP:
 * + IF IP OLD, CHANGE IP STATUS: OFFLINE -> ONLINE
 * + IF IP NEW, PUSH INTO USER
 * 3. SIGNUP:
 * - CREATE USER
 * - PUSH NEW IP INTO USER
 */
export const google = async (req, res, next) => {
  const { name, email, photo, ip, country } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      let isNewIP = true;

      user.ip_logger.forEach((log) => {
        if (log.ip === ip) {
          isNewIP = false;
          log.status = IP_STATUS.ONLINE;
        }
      });

      if (isNewIP) {
        user.ip_logger.push({
          ip: ip,
          country: country,
          status: IP_STATUS.ONLINE,
        });
      }

      await user.save();

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      const { password: userPassword, ...rest } = user._doc;

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: expiredAccessToken,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: expiredRefreshToken,
      });

      res.status(200).json({ user: rest });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        // Example: fumo dayo -> fumo-dayo-17283
        username:
          name.split(" ").join("-").toLowerCase() +
          "-" +
          Math.floor(Math.random() * 10000).toString(),
        user_id: Math.floor(Math.random() * 1000000).toString(),
        email,
        password: hashedPassword,
        profile_picture: photo,
      });

      newUser.ip_logger.push({
        ip: ip,
        country: country,
        status: IP_STATUS.ONLINE,
      });

      await newUser.save();

      const accessToken = jwt.sign(
        { id: newUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { id: newUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      const { password: userPassword2, ...rest } = newUser._doc;

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: expiredAccessToken,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: expiredRefreshToken,
      });

      res.status(200).json({ user: rest });
    }
  } catch (error) {
    next(errorHandler(500, "Server Error"));
  }
};

/*
 * LOGOUT
 * 1. CHECK EXISTS USER IN DATABASE
 * 2. FIND IP AND UPDATE IP STATUS: ONLINE -> OFFLINE
 * 3. CLEAR COOKIE
 */
export const signout = async (req, res, next) => {
  try {
    const { ip, id } = req.body;

    const validUser = await User.findById(id);
    if (!validUser) return next(errorHandler(404, "User not found"));

    validUser.ip_logger.forEach((log) => {
      if (log.ip === ip) {
        log.status = IP_STATUS.OFFLINE;
      }
    });

    await validUser.save();
    res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(200)
      .json("Signout success");
  } catch (error) {
    next(error);
  }
};

export const logoutAll = async (req, res, next) => {
  try {
    const { id } = req.body;

    const validUser = await User.findById(id);
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    validUser.ip_logger.forEach((ip) => {
      ip.status = IP_STATUS.OFFLINE;
    });

    await validUser.save();

    return res
      .clearCookie("access_token")
      .status(200)
      .json("Logout all devices success");
  } catch (error) {
    next(error);
  }
};
