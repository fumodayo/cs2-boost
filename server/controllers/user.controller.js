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
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can update only your account"));
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
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
 * 3. CHANGE USER ROLE: CLIENT -> BOOSTER
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
        $set: {
          role: ROLE.BOOSTER,
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
