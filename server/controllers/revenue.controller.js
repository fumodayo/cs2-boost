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
      return res.status(400).json([]);
    }

    // const revenue = {
    //   income: [
    //     {
    //       amount: 430000,
    //       status: "deposit",
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       amount: 412000,
    //       status: "deposit",
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       amount: 322500,
    //       status: "deposit",
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       amount: 217100,
    //       status: "deposit",
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       amount: 117500,
    //       status: "deposit",
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       amount: 394800,
    //       status: "deposit",
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       amount: 245400,
    //       status: "deposit",
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       amount: 380600,
    //       status: "deposit",
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       amount: 492900,
    //       status: "withdraw",
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       amount: 393200,
    //       status: "fine",
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       amount: 488700,
    //       status: "deposit",
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       amount: 450000,
    //       status: "deposit",
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   money_pending: [
    //     {
    //       amount: 120000,
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       amount: 220000,
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       amount: 320000,
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       amount: 100000,
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       amount: 150000,
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       amount: 170000,
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       amount: 190000,
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       amount: 220000,
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       amount: 520000,
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       amount: 220000,
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       amount: 320000,
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       amount: 120000,
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   money_profit: [
    //     {
    //       amount: 125000,
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       amount: 225000,
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       amount: 325000,
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       amount: 105000,
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       amount: 155000,
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       amount: 175000,
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       amount: 195000,
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       amount: 225000,
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       amount: 525000,
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       amount: 225000,
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       amount: 325000,
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       amount: 125000,
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   money_fine: [
    //     {
    //       amount: 110000,
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       amount: 210000,
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       amount: 310000,
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       amount: 95000,
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       amount: 145000,
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       amount: 165000,
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       amount: 185000,
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       amount: 210000,
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       amount: 510000,
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       amount: 210000,
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       amount: 310000,
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       amount: 110000,
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   orders_pending: [
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   orders_completed: [
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   orders_cancel: [
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       order: "663ee2746315c5e95cccdc6c",
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   total_order_pending: [
    //   {
    //       amount: 12,
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       amount: 3,
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       amount: 6,
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       amount: 8,
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       amount: 2,
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       amount: 1,
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       amount: 14,
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       amount: 7,
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       amount: 10,
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       amount: 4,
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       amount: 9,
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       amount: 5,
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   total_order_completed: [
    //     {
    //       amount: 11,
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       amount: 2,
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       amount: 5,
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       amount: 7,
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       amount: 1,
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       amount: 3,
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       amount: 13,
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       amount: 6,
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       amount: 9,
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       amount: 4,
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       amount: 8,
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       amount: 5,
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   total_order_cancel: [
    //     {
    //       amount: 10,
    //       createdAt: "2024-05-06T08:23:15.000Z",
    //     },
    //     {
    //       amount: 1,
    //       createdAt: "2024-05-07T08:23:15.000Z",
    //     },
    //     {
    //       amount: 4,
    //       createdAt: "2024-05-08T08:23:15.000Z",
    //     },
    //     {
    //       amount: 6,
    //       createdAt: "2024-05-09T08:23:15.000Z",
    //     },
    //     {
    //       amount: 2,
    //       createdAt: "2024-05-10T08:23:15.000Z",
    //     },
    //     {
    //       amount: 2,
    //       createdAt: "2024-05-11T08:23:15.000Z",
    //     },
    //     {
    //       amount: 11,
    //       createdAt: "2024-05-12T08:23:15.000Z",
    //     },
    //     {
    //       amount: 5,
    //       createdAt: "2024-05-13T08:23:15.000Z",
    //     },
    //     {
    //       amount: 8,
    //       createdAt: "2024-05-14T08:23:15.000Z",
    //     },
    //     {
    //       amount: 3,
    //       createdAt: "2024-05-15T08:23:15.000Z",
    //     },
    //     {
    //       amount: 7,
    //       createdAt: "2024-05-16T08:23:15.000Z",
    //     },
    //     {
    //       amount: 4,
    //       createdAt: "2024-05-17T08:23:15.000Z",
    //     },
    //   ],
    //   total_money_pending: 720000,
    //   total_money_profit: 800000,
    //   total_money_fine: 540000,
    // };

    const period = {
      money: req.body.periodMoney || "week",
      order: req.body.periodOrder || "week",
    };

    const today = moment();
    const getPeriodRange = (period) => {
      if (period === "week") {
        return {
          start: today.clone().startOf("isoWeek"),
          end: today.clone().endOf("isoWeek"),
        };
      }
      if (period === "month") {
        return {
          start: today.clone().startOf("month"),
          end: today.clone().endOf("month"),
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
      income: filterRevenueByDay(
        revenue.income,
        rangeMoney.start,
        rangeMoney.end
      ),
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
    });

    // res.status(200).json({
    //   income: 0,
    //   money_pending: [],
    //   money_profit: [],
    //   money_fine: [],
    //   record_money_profit: [],
    // });
  } catch (error) {
    next(error);
  }
};
