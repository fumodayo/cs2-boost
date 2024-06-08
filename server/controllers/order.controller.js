import {
  INCOME_STATUS,
  NOTIFICATION_TYPE,
  ORDER_STATUS,
} from "../constants/index.js";
import Order from "../models/order.model.js";
import Conversation from "../models/conversation.model.js";
import { io } from "../socket/socket.js";
import Notification from "../models/notification.model.js";
import Revenue from "../models/revenue.model.js";
import { errorHandler } from "../utils/error.js";

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

    const pageSize = parseInt(req.query.pageSize) || 5;
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
  const { searchKey, gameKey, sortKey } = req.query;

  let query = { status: ORDER_STATUS.IN_ACTIVE, user: { $ne: req.user.id } };

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

    const pageSize = parseInt(req.query.pageSize) || 5;
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
 * 1. GET ALL ORDER HAVEN'T STATUS: IN_PENDING, IN_INACTIVE
 * 2. FIND BY SEARCH KEY
 * 3. FILTER BY GAME KEY AND STATUS KEY
 */
export const getProgressOrder = async (req, res, next) => {
  const { id } = req.user;
  const { searchKey, gameKey, statusKey, sortKey } = req.query;

  let query = {
    status: { $in: [ORDER_STATUS.COMPLETED, ORDER_STATUS.IN_PROGRESS] },
    booster: id,
  };

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
    const completedOrdersCount = await Order.countDocuments({
      status: ORDER_STATUS.COMPLETED,
      booster: id,
    });

    const inProgressOrdersCount = await Order.countDocuments({
      status: ORDER_STATUS.IN_PROGRESS,
      booster: id,
    });

    let sortOption = { createdAt: -1 };
    if (sortKey) {
      if (sortKey.startsWith("-")) {
        const field = sortKey.substring(1);
        sortOption = { [field]: -1 };
      } else {
        sortOption = { [sortKey]: 1 };
      }
    }

    const pageSize = parseInt(req.query.pageSize) || 5;
    const page = parseInt(req.query.page) || 1;

    const countingPage = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
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

    res.status(200).json({
      orders: orders,
      completed: completedOrdersCount,
      in_progress: inProgressOrdersCount,
      countingPage,
      page,
      pages,
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
      .populate({
        path: "booster",
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
  try {
    const existingOrder = await Order.findOne({ boost_id: req.params.id });

    if (existingOrder.booster) {
      return next(errorHandler(400, "Order already has a booster assigned"));
    }

    const updatedOrder = await Order.findOneAndUpdate(
      {
        boost_id: req.params.id,
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
      participants: [updatedOrder.user, updatedOrder.booster],
      messages: [],
    });

    const newConversation = await conversation.save();

    await Order.findByIdAndUpdate(updatedOrder._id, {
      conversation: newConversation._id,
    });

    let revenueExisting = await Revenue.findOne({ user: req.user.id });

    const today = new Date();
    const isNewDay = revenueExisting
      ? new Date(revenueExisting.createdAt).getDate() !== today.getDate()
      : true;

    if (revenueExisting) {
      if (isNewDay) {
        // Nếu là ngày mới, tạo mục mới
        revenueExisting.money_pending.push({ amount: updatedOrder.price });
        revenueExisting.total_order_pending.push({ amount: 1 });
      } else {
        // Nếu không phải ngày mới, cập nhật mục hiện tại
        const lastIndex = revenueExisting.money_pending.length - 1;

        // Cập nhật giá trị cuối cùng của money_pending
        revenueExisting.money_pending[lastIndex].amount += updatedOrder.price;

        // Cập nhật giá trị cuối cùng của total_order_pending
        revenueExisting.total_order_pending[lastIndex].amount += 1;
      }

      // Cập nhật tổng số tiền và đơn hàng đang chờ
      revenueExisting.total_money_pending += updatedOrder.price;
      revenueExisting.orders_pending.push({ order: updatedOrder._id });
    } else {
      // Nếu không có revenueExisting, tạo đối tượng mới
      revenueExisting = new Revenue({
        user: req.user.id,
        money_pending: [{ amount: updatedOrder.price }],
        orders_pending: [{ order: updatedOrder._id }],
        total_order_pending: [{ amount: 1 }],
        total_money_pending: updatedOrder.price,
      });
    }

    await revenueExisting.save();

    res.status(201).json("Accepted order");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/**
 * COMPLETED ORDER BY BOOST_ID
 */
export const completedOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updateOrder = await Order.findOneAndUpdate(
      {
        boost_id: id,
      },
      {
        $set: {
          status: ORDER_STATUS.COMPLETED,
        },
      },
      { new: true }
    );

    // Tìm đối tượng Revenue của người dùng
    let revenueExisting = await Revenue.findOne({ user: req.user.id });
    if (!revenueExisting) {
      return next(errorHandler(400, "Revenue not found"));
    }

    const today = new Date();
    const isNewDay = revenueExisting
      ? new Date(revenueExisting.createdAt).getDate() !== today.getDate()
      : true;

    if (isNewDay) {
      // Nếu là ngày mới, tạo mục mới
      revenueExisting.money_profit.push({ amount: updateOrder.price });
      revenueExisting.total_order_completed.push({ amount: 1 });
    } else {
      // Nếu không phải ngày mới, cập nhật mục hiện tại
      if (revenueExisting.money_profit.length > 0) {
        // Cập nhật giá trị cuối cùng của money_profit
        revenueExisting.money_profit[
          revenueExisting.money_profit.length - 1
        ].amount += updateOrder.price;
      } else {
        // Nếu mảng trống, thêm phần tử mới
        revenueExisting.money_profit.push({ amount: updateOrder.price });
      }

      if (revenueExisting.total_order_completed.length > 0) {
        // Cập nhật giá trị cuối cùng của total_order_completed
        revenueExisting.total_order_completed[
          revenueExisting.total_order_completed.length - 1
        ].amount += 1;
      } else {
        // Nếu mảng trống, thêm phần tử mới
        revenueExisting.total_order_completed.push({ amount: 1 });
      }
    }

    // Cập nhật tổng số tiền đang chờ và tổng số tiền thu được
    revenueExisting.total_money_pending -= updateOrder.price;
    revenueExisting.total_money_profit += updateOrder.price;
    revenueExisting.total_money += updateOrder.price;

    // Loại bỏ đơn hàng đã hoàn thành khỏi danh sách orders_pending
    revenueExisting.orders_pending.pull({ order: updateOrder._id });

    // Thêm đơn hàng đã hoàn thành vào danh sách orders_completed
    revenueExisting.orders_completed.push({ order: updateOrder._id });

    // Thêm giá trị thu nhập mới vào income
    revenueExisting.income.push({ amount: updateOrder.price });

    // Lưu các thay đổi vào đối tượng Revenue
    await revenueExisting.save();

    res.status(201).json("Completed order");
  } catch (error) {
    next(error);
  }
};

/**
 * CANCEL ORDER BY BOOST_ID
 * REDUCED 1% ORDER
 * SET ORDER STATUS: IN_PROGRESS -> IN_ACTIVE
 */
export const cancelOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const updateOrder = await Order.findOneAndUpdate(
      {
        boost_id: id,
      },
      {
        $set: {
          status: ORDER_STATUS.IN_ACTIVE,
          booster: null,
        },
      },
      { new: true }
    );

    // Tìm đối tượng Revenue của người dùng
    let revenueExisting = await Revenue.findOne({ user: req.user.id });
    if (!revenueExisting) {
      return next(errorHandler(400, "Revenue not found"));
    }

    const today = new Date();
    const isNewDay = revenueExisting
      ? new Date(revenueExisting.createdAt).getDate() !== today.getDate()
      : true;

    const finePrice = updateOrder.price * 0.1;

    if (isNewDay) {
      // Nếu là ngày mới, tạo mục mới
      revenueExisting.money_fine.push({ amount: finePrice });
      revenueExisting.total_order_cancel.push({ amount: 1 });
    } else {
      // Nếu không phải ngày mới, cập nhật mục hiện tại
      if (revenueExisting.money_fine.length > 0) {
        // Cập nhật giá trị cuối cùng của money_fine
        revenueExisting.money_fine[
          revenueExisting.money_fine.length - 1
        ].amount += finePrice;
      } else {
        // Nếu mảng trống, thêm phần tử mới
        revenueExisting.money_fine.push({ amount: finePrice });
      }

      if (revenueExisting.total_order_cancel.length > 0) {
        // Cập nhật giá trị cuối cùng của total_order_cancel
        revenueExisting.total_order_cancel[
          revenueExisting.total_order_cancel.length - 1
        ].amount += 1;
      } else {
        // Nếu mảng trống, thêm phần tử mới
        revenueExisting.total_order_cancel.push({ amount: 1 });
      }
    }

    // Cập nhật tổng số tiền đang chờ và tổng số tiền phạt
    revenueExisting.total_money_pending -= updateOrder.price;
    revenueExisting.total_money_fine += finePrice;
    revenueExisting.total_money -= finePrice;

    // Loại bỏ đơn hàng đã hủy khỏi danh sách orders_pending
    revenueExisting.orders_pending.pull({ order: updateOrder._id });

    // Thêm đơn hàng đã hủy vào danh sách orders_cancel (giả định rằng danh sách này tồn tại)
    revenueExisting.orders_cancel.push({ order: updateOrder._id });

    // Thêm giá trị thu nhập bị phạt vào income
    revenueExisting.income.push({
      amount: -finePrice,
      status: INCOME_STATUS.FINE,
    });

    // Lưu các thay đổi vào đối tượng Revenue
    await revenueExisting.save();

    res.status(201).json("Cancel order");
  } catch (error) {
    next(error);
  }
};
