import mongoose from "mongoose";

const PremierPriceListSchema = new mongoose.Schema(
  {
    price_list: [
      {
        name: String,
        value: String,
        costs: [
          {
            start: Number,
            end: Number,
            bonus: Number,
          },
        ],
      },
    ],
    unit_price: Number,
  },
  { timestamps: true }
);

const PremierPriceList = mongoose.model(
  "PremierPriceList",
  PremierPriceListSchema
);

export default PremierPriceList;
