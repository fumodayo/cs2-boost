import Account from "../models/account.model.js";
import Order from "../models/order.model.js";

// CREATE ACCOUNT
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
