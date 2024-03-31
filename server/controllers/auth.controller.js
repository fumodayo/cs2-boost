import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { IP_STATUS } from "../constants/index.js";

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

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: userPassword, ...rest } = validUser._doc;

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(201)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

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

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: hashedPassword, ...rest } = validUser._doc;

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour

    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, photo, ip, country, city } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      let isNewIP = true;

      // Check if the IP is already in the ip_logger array
      user.ip_logger.forEach((log) => {
        if (log.ip === ip) {
          isNewIP = false;
          log.status = IP_STATUS.ONLINE; // Set status to online for existing IP
        }
      });

      if (isNewIP) {
        // If IP is not present, add it to the ip_logger array
        user.ip_logger.push({
          ip: ip,
          country: country,
          city: city,
          status: IP_STATUS.ONLINE,
        });
      }

      await user.save(); // Save the updated user

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
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

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour

      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(errorHandler(500, "Server Error"));
  }
};

export const signout = async (req, res) => {
  try {
    const { ip } = req.body;
    const { id } = req.user;

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
