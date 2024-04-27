import { ORDER_STATUS } from "../constants/index.js";
import Order from "../models/order.model.js";
import Conversation from "../models/conversation.model.js";

/*
 * GET ALL ORDER
 * 1. GET ALL ORDER
 * 2. FIND BY SEARCH KEY
 * 3. FILTER BY GAME KEY AND STATUS KEY
 */
export const getAllOrder = async (req, res, next) => {
  const { id } = req.user;
  const { searchKey, gameKey, statusKey, sortKey } = req.query;
  let query = { user: id };

  if (searchKey) {
    query.$or = [
      { title: { $regex: searchKey, $options: "i" } },
      { boost_id: { $regex: searchKey, $options: "i" } },
    ];
  }

  if (gameKey && gameKey.length > 0) {
    const gameKeys = gameKey.split(",");
    query.game = { $in: gameKeys };
  }

  if (statusKey && statusKey.length > 0) {
    const statusKeys = statusKey.split(",");
    query.status = { $in: statusKeys };
  }

  try {
    let sortOption = { createdAt: -1 };
    if (sortKey) {
      if (sortKey.startsWith("-")) {
        const field = sortKey.substring(1);
        sortOption = { [field]: -1 };
      } else {
        sortOption = { [sortKey]: 1 };
      }
    }

    const pageSize = parseInt(req.query.pageSize) || 2;
    const page = parseInt(req.query.page) || 1;
    
    const countingPage = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort(sortOption)
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "booster",
        select: "-password",
      });

    const pages = Math.ceil(countingPage / pageSize);

    res.status(200).json({ orders: orders, countingPage, page, pages });
  } catch (error) {
    next(error);
  }
};

/*
 * GET ALL PENDING ORDER
 * 1. GET ALL ORDER HAVE STATUS: IN_ACTIVE
 * 2. FIND BY SEARCH KEY
 * 3. FILTER BY GAME KEY AND STATUS KEY
 */
export const getPendingOrder = async (req, res, next) => {
  const { id } = req.user;
  const { searchKey, gameKey, statusKey } = req.query;

  let query = { status: ORDER_STATUS.IN_ACTIVE };

  try {
    const orders = await Order.find(query).populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

/*
 * GET ALL PENDING ORDER
 * 1. GET ALL ORDER HAVEN'T STATUS: IN_PENDING, IN_INACTIVE
 * 2. FIND BY SEARCH KEY
 * 3. FILTER BY GAME KEY AND STATUS KEY
 */
export const getProgressOrder = async (req, res, next) => {
  const { id } = req.user;
  const { searchKey, gameKey, statusKey } = req.query;

  let query = {
    status: { $nin: [ORDER_STATUS.PENDING, ORDER_STATUS.IN_ACTIVE] },
    booster: { $ne: id },
  };

  try {
    const completedOrdersCount = await Order.countDocuments({
      status: ORDER_STATUS.COMPLETED,
      booster: id,
    });

    const inProgressOrdersCount = await Order.countDocuments({
      status: ORDER_STATUS.IN_PROGRESS,
    });

    const orders = await Order.find(query).populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json({
      orders: orders,
      completed: completedOrdersCount,
      in_progress: inProgressOrdersCount,
    });
  } catch (error) {
    next(error);
  }
};

/*
 * CREATE ORDER
 */
export const createOrder = async (req, res, next) => {
  const {
    title,
    game,
    type,
    price,
    currency,
    options,
    status,
    server,
    start_exp,
    end_exp,
    start_rating,
    end_rating,
    start_rank,
    end_rank,
  } = req.body;
  const { id } = req.user;

  try {
    const newOrder = new Order({
      boost_id: Math.floor(Math.random() * 1000000).toString(),
      title,
      game,
      type,
      price,
      currency,
      options,
      status,
      server,
      start_exp,
      end_exp,
      start_rating,
      end_rating,
      start_rank,
      end_rank,
      user: id,
    });

    await newOrder.save();

    res.status(201).json(newOrder.boost_id);
  } catch (error) {
    next(error);
  }
};

/*
 * CREATE ORDER BY BOOST_ID
 */
export const getOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await Order.find({ boost_id: id })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("account")
      .populate("conversation");

    res.status(200).json(order[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * ACCEPT ORDER BY BOOST_ID
 * 1. CREATE CONVERSATION
 * 2. FILL BOOSTER_ID INTO ORDER
 * 3. FILL CONVERSATION_ID INTO ORDER
 */
export const acceptOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findOneAndUpdate(
      {
        boost_id: id,
      },
      {
        $set: {
          booster: req.user.id,
          status: ORDER_STATUS.IN_PROGRESS,
        },
      },
      { new: true }
    );

    const conversation = new Conversation({
      participants: [order.user, order.booster],
      messages: [],
    });

    const newConversation = await conversation.save();

    await Order.findByIdAndUpdate(order._id, {
      conversation: newConversation._id,
    });

    res.status(201).json("Accepted order");
  } catch (error) {
    next(error);
  }
};
