import PremierPriceList from "../models/premier.model.js";
import WingmanPriceList from "../models/wingman.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";
import { ROLE } from "../constants/index.js";

export const getWingmanPrice = async (_, res, next) => {
  try {
    const table_price = await WingmanPriceList.findOne({});

    if (!table_price) next(errorHandler(400, "Invalid"));
    return res.status(200).json(table_price);
  } catch (error) {
    next(error);
  }
};

export const getPremierPrice = async (_, res, next) => {
  try {
    const table_price = await PremierPriceList.findOne({});

    if (!table_price) next(errorHandler(400, "Invalid"));
    return res.status(200).json(table_price);
  } catch (error) {
    next(error);
  }
};

export const updateWingmanPrice = async (req, res, next) => {
  const { id } = req.user;
  const { unit_price, price_list } = req.body;
  try {
    const user = await User.findOne({ _id: id, role: ROLE.ADMIN });
    if (!user) next(errorHandler(403, "Must be have admin role"));

    const update_list = await WingmanPriceList.findOneAndUpdate(
      {},
      { unit_price, price_list },
      { new: true }
    );

    if (!update_list) next(errorHandler(404, "Price List Not Found"));

    res.status(200).json(update_list);
  } catch (error) {
    next(error);
  }
};

export const updatePremierPrice = async (req, res, next) => {
  const { id } = req.user;
  const { unit_price, price_list } = req.body;
  try {
    const user = await User.findOne({ _id: id, role: ROLE.ADMIN });
    if (!user) next(errorHandler(403, "Must be have admin role"));

    const update_list = await PremierPriceList.findOneAndUpdate(
      {},
      { unit_price, price_list },
      { new: true }
    );

    if (!update_list) next(errorHandler(404, "Price List Not Found"));

    res.status(200).json(update_list);
  } catch (error) {
    next(error);
  }
};
