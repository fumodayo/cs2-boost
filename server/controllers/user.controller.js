import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Account from "../models/account.model.js";
import { ROLE } from "../constants/index.js";

/*
 * GET USER
 * - CHECK EXISTS USER IN DATABASE
 */
export const getUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can get only your account"));
  }

  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// UPDATE USER
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { username, profile_picture, old_password, new_password } = req.body;

    if (id !== req.params.id) {
      return next(errorHandler(401, "You can update only your account"));
    }

    let updatedUser;

    if (old_password || new_password) {
      const validUser = await User.findById(id);
      if (!validUser) {
        return next(errorHandler(404, "User not found"));
      }

      const validPassword = await bcryptjs.compare(
        old_password,
        validUser.password
      );
      if (!validPassword) {
        return next(errorHandler(401, "Wrong old password"));
      }

      if (new_password) {
        const hashedPassword = await bcryptjs.hash(new_password, 10);
        updatedUser = await User.findByIdAndUpdate(
          id,
          { $set: { password: hashedPassword } },
          { new: true }
        );
      }
    } else {
      const updateFields = {};
      if (username) updateFields.username = username;
      if (profile_picture) updateFields.profile_picture = profile_picture;

      updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
      );
    }

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/*
 * DELETE USER
 * 1. CHECK EXISTS USER IN DATABASE
 * 2. DELETE USER BY ID
 * 3. DELETE ALL ORDER BY ID
 * 4. DELETE ALL ACCOUNT BY ID
 * 5. CLEAR COOKIES
 */
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can delete only your account!"));
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    await Order.deleteMany({ user: req.params.id });
    await Account.deleteMany({ user_id: req.params.id });
    res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "User has been deleted" });
  } catch (error) {
    next(errorHandler(401, error.message));
  }
};

/*
 * VERIFICATION USER
 * 1. CHECK EXISTS USER IN DATABASE
 * 2. PUSH CCCD INFORMATION INTO USER
 * 3. CHANGE USER ROLE: ['CLIENT'] -> ['CLIENT','BOOSTER']
 */
export const verificationUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can verify only your account"));
  }

  try {
    const {
      addresses,
      cccd_number,
      cccd_issue_date,
      date_of_birth,
      gender,
      phone_number,
      real_name,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          role: ROLE.BOOSTER,
        },
        $set: {
          is_verified: true,
          addresses: addresses,
          cccd_number: cccd_number,
          cccd_issue_date: cccd_issue_date,
          date_of_birth: date_of_birth,
          gender: gender,
          phone_number: phone_number,
          real_name: real_name,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

/**
 * CONNECT SOCAIL MEDIA
 */
export const connectSocialMediaUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can verify only your account"));
  }

  try {
    const { type, link, username, code } = req.body;
    console.log(type, link, username, code);

    const validUser = await User.findById(req.params.id);

    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const existingSocial = validUser.social_media.find(
      (social) => social.type === type
    );

    if (existingSocial) {
      existingSocial.link = link;
      existingSocial.username = username;
      existingSocial.code = code;
    } else {
      validUser.social_media.push({
        type: type,
        link: link,
        username: username,
        code: code,
      });
    }

    const updatedUser = await validUser.save();
    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
