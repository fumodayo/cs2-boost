import { INCOME_STATUS } from "../constants/index.js";
import Revenue from "../models/revenue.model.js";
import { errorHandler } from "../utils/error.js";
import moment from "moment";

const filterRevenueByDay = (revenues, startDate, endDate) => {
  return revenues.filter((money) =>
    moment(money.createdAt).isBetween(startDate, endDate)
  );
};

export const getAllRevenue = async (req, res, next) => {
  const { id } = req.user;

  try {
    const revenue = await Revenue.findOne({ user: id });

    if (!revenue) {
      return res.status(400).json({
        income: [],
        money_pending: [],
        money_profit: [],
        money_fine: [],
        orders_pending: 0,
        orders_completed: 0,
        orders_cancel: 0,
        total_order_pending: [],
        total_order_completed: [],
        total_order_cancel: [],
        total_money_pending: 0,
        total_money_profit: 0,
        total_money_fine: 0,
      });
    }

    const period = {
      money: req.body.periodMoney || "week",
      order: req.body.periodOrder || "week",
    };

    const today = moment();
    const getPeriodRange = (period) => {
      if (period === "week") {
        return {
          start: today.clone().startOf("isoWeek"),
          end: today.clone(),
        };
      }
      if (period === "month") {
        return {
          start: today.clone().subtract(1, "months").add(1, "days"),
          end: today.clone(),
        };
      }
      return {
        start: today.clone().startOf("day"),
        end: today.clone().endOf("day"),
      };
    };

    const rangeMoney = getPeriodRange(period.money);
    const rangeOrder = getPeriodRange(period.order);

    res.status(200).json({
      income: revenue.income,
      money_pending: filterRevenueByDay(
        revenue.money_pending,
        rangeMoney.start,
        rangeMoney.end
      ),
      money_profit: filterRevenueByDay(
        revenue.money_profit,
        rangeMoney.start,
        rangeMoney.end
      ),
      money_fine: filterRevenueByDay(
        revenue.money_fine,
        rangeMoney.start,
        rangeMoney.end
      ),
      orders_pending: revenue.orders_pending,
      orders_completed: revenue.orders_completed,
      orders_cancel: revenue.orders_cancel,
      total_order_pending: filterRevenueByDay(
        revenue.total_order_pending,
        rangeOrder.start,
        rangeOrder.end
      ),
      total_order_completed: filterRevenueByDay(
        revenue.total_order_completed,
        rangeOrder.start,
        rangeOrder.end
      ),
      total_order_cancel: filterRevenueByDay(
        revenue.total_order_cancel,
        rangeOrder.start,
        rangeOrder.end
      ),
      total_money_pending: revenue.total_money_pending,
      total_money_profit: revenue.total_money_profit,
      total_money_fine: revenue.total_money_fine,
      total_money: revenue.total_money,
    });
  } catch (error) {
    next(error);
  }
};

export const withdrawRevenue = async (req, res, next) => {
  const { id } = req.user;

  try {
    const revenue = await Revenue.findOne({ user: id });

    if (!revenue) {
      return errorHandler(400, "Revenue not found");
    }

    const { money } = req.body;

    revenue.income.push({
      amount: -money,
      status: INCOME_STATUS.WITHDRAW,
    });
    revenue.total_money -= money;
    await revenue.save();

    res.status(201).json("Withdraw completed");
  } catch (error) {
    next(error);
  }
};
