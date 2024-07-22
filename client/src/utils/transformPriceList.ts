import { PremierPriceList, WingmanPriceList } from "../types";

type TransformedPriceList = {
  [key: string]: { label: string | number; note?: string }[];
};

export const transformWingmanPriceList = (data: WingmanPriceList[]) => {
  const result: TransformedPriceList = {
    "Rating/ Server": [
      { label: "Silver I", note: "Rank" },
      { label: "Silver II", note: undefined },
      { label: "Silver III" },
      { label: "Silver IV" },
      { label: "Silver Elite" },
      { label: "Silver Elite Master" },
      { label: "Gold Nova I" },
      { label: "Gold Nova II" },
      { label: "Gold Nova III" },
      { label: "Gold Nova Master" },
      { label: "Master Guardian I" },
      { label: "Master Guardian II" },
      { label: "Master Guardian Elite" },
      { label: "Distinguished Master Guardian" },
      { label: "Legendary Eagle" },
      { label: "Legendary Eagle Master" },
      { label: "Supreme Master First Class" },
      { label: "The Global Elite" },
    ],
  };

  data.forEach((region) => {
    result[`${region.name} (${region.value})`] = region.costs.map(
      (cost, index) => ({
        label: cost.bonus,
        note: index === 0 ? "Coefficient calculated by region" : undefined,
      }),
    );
  });

  return result;
};

export const transformPremiePriceList = (data: PremierPriceList[]) => {
  const result: TransformedPriceList = {
    "Rating/ Server": [
      { label: "1000->4999", note: "Rating score" },
      { label: "5,000->9,999" },
      { label: "10,000->14,999" },
      { label: "15,000->19,999" },
      { label: "20,000->24,999" },
      { label: "25,000->29,999" },
      { label: "30,000+" },
    ],
  };

  data.forEach((region) => {
    const regionKey = `${region.name} (${region.value})`;
    result[regionKey] = region.costs.map((cost, index) => ({
      label: cost.bonus,
      note: index === 0 ? "Coefficient calculated by region" : undefined,
    }));
  });

  return result;
};
