import Account from "../models/account.model.js";
import Order from "../models/order.model.js";

/*
 * CREATE ACCOUNT
 * 1. CREATE ACCOUNT
 * 2. PUSH ACCOUNT_ID INTO ORDER
 */
export const createAccount = async (req, res, next) => {
  const { username, password, backup_code, order_id } = req.body;
  const { id } = req.user;

  try {
    const newAccount = new Account({
      user_id: id,
      username: username,
      password: password,
      backup_code: backup_code,
    });

    await newAccount.save();

    await Order.findOneAndUpdate(
      { boost_id: order_id },
      {
        $set: {
          account: newAccount._id,
        },
      },
      { new: true }
    );

    res.status(201).json("Account created successfully");
  } catch (error) {
    next(error);
  }
};

/**
 * EDIT ACCOUNT
 */
export const editAccount = async (req, res, next) => {
  try {
    const { account_id, username, password, backup_code } = req.body;

    await Account.findByIdAndUpdate(
      account_id,
      {
        $set: {
          username: username,
          password: password,
          backup_code: backup_code,
        },
      },
      { new: true }
    );

    res.status(201).json("Account updated successfully");
  } catch (error) {
    next(error);
  }
};
