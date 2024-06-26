import Invoice from "../models/invoice.model.js";

/*
 * GET ALL WALLET
 */
export const getAllWallet = async (req, res, next) => {
  const { id } = req.user;
  const { searchKey, typeKey, sortKey } = req.query;
  let query = { user: id };

  if (searchKey) {
    query.$or = [{ boost_id: { $regex: searchKey, $options: "i" } }];
  }

  if (typeKey) {
    if (Array.isArray(typeKey)) {
      query.type = { $in: typeKey };
    } else if (typeof typeKey === "string") {
      const typeKeys = typeKey.split(",");
      query.type = { $in: typeKeys };
    }
  }

  try {
    let sortOption = { updatedAt: -1 };
    if (sortKey) {
      if (sortKey.startsWith("-")) {
        const field = sortKey.substring(1);
        sortOption = { [field === "updated_at" ? "updatedAt" : field]: -1 };
      } else {
        sortOption = { [sortKey === "updated_at" ? "updatedAt" : sortKey]: 1 };
      }
    }

    const pageSize = parseInt(req.query.pageSize) || 5;
    const page = parseInt(req.query.page) || 1;

    const countingPage = await Invoice.countDocuments(query);

    const invoices = await Invoice.find(query)
      .sort(sortOption)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const pages = Math.ceil(countingPage / pageSize);

    res.status(200).json({ invoices: invoices, countingPage, page, pages });
  } catch (error) {
    next(error);
  }
};
