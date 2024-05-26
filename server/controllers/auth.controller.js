import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { IP_STATUS } from "../constants/index.js";

const expiryTime = 60 * 60 * 1000; // 1 hour

/*
 * SIGNUP
 * 1. CHECK EXISTS USER IN DATABASE
 * 2. CREATE USER
 * 3. PUSH NEW IP INTO USER
 */
export const signup = async (req, res, next) => {
  const { email, password, ip, country, city } = req.body;
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

    newUser.ip_logger.push({ ip, country, city });

    const validUser = await newUser.save();

    const token = jwt.sign(
      { id: validUser._id, ip: ip, role: validUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const { password: userPassword, ...rest } = validUser._doc;

    const expiryDate = new Date(Date.now() + expiryTime);

    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(201)
      .json({ user: rest, access_token: token });
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
  const { email, password, ip, country, city } = req.body;
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
        city: city,
        status: IP_STATUS.ONLINE,
      });
    }

    await validUser.save(); // Save the updated user

    const token = jwt.sign(
      { id: validUser._id, ip: ip, role: validUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const expiryDate = new Date(Date.now() + expiryTime);
    const { password: hashedPassword, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json({ user: rest, access_token: token });
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
  const { name, email, photo, ip, country, city } = req.body;

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
          city: city,
          status: IP_STATUS.ONLINE,
        });
      }

      await user.save();

      const token = jwt.sign(
        { id: user._id, ip: ip, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + expiryTime);

      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json({ user: rest, access_token: token });
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
        city: city,
        status: IP_STATUS.ONLINE,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, ip: ip, role: newUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      const expiryDate = new Date(Date.now() + expiryTime); // 1 hour
      const { password: hashedPassword2, ...rest } = newUser._doc;

      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json({ user: rest, access_token: token });
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
    res.clearCookie("access_token").status(200).json("Signout success");
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
