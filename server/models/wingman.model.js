import mongoose from "mongoose";

const WingmanPriceListSchema = new mongoose.Schema(
  {
    price_list: [
      {
        name: String,
        value: String,
        costs: [
          {
            code: String,
            name: String,
            image: String,
            bonus: Number,
          },
        ],
      },
    ],
    unit_price: Number,
  },
  { timestamps: true }
);

const WingmanPriceList = mongoose.model(
  "WingmanPriceList",
  WingmanPriceListSchema
);

export default WingmanPriceList;
