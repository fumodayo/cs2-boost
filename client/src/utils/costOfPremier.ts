type ICostOfPremier = {
  beginRating: number;
  endRating: number;
  server: string;
};

const costOfPremier = ({ beginRating, endRating, server }: ICostOfPremier) => {
  const listRates = [
    {
      name: "Asia",
      value: "AS",
      rates: [
        {
          start: 1000,
          end: 4999,
          rate: 1,
        },
        {
          start: 5000,
          end: 9999,
          rate: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          rate: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          rate: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          rate: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          rate: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          rate: 38.4,
        },
      ],
    },
    {
      name: "Africa",
      value: "AF",
      rates: [
        {
          start: 1000,
          end: 4999,
          rate: 1,
        },
        {
          start: 5000,
          end: 9999,
          rate: 1,
        },
        {
          start: 10000,
          end: 14999,
          rate: 2,
        },
        {
          start: 15000,
          end: 19999,
          rate: 4,
        },
        {
          start: 20000,
          end: 24999,
          rate: 8,
        },
        {
          start: 25000,
          end: 29999,
          rate: 16,
        },
        {
          start: 30000,
          end: 32000,
          rate: 32,
        },
      ],
    },
    {
      name: "China",
      value: "CN",
      rates: [
        {
          start: 1000,
          end: 4999,
          rate: 1,
        },
        {
          start: 5000,
          end: 9999,
          rate: 1.5,
        },
        {
          start: 10000,
          end: 14999,
          rate: 3,
        },
        {
          start: 15000,
          end: 19999,
          rate: 6,
        },
        {
          start: 20000,
          end: 24999,
          rate: 12,
        },
        {
          start: 25000,
          end: 29999,
          rate: 24,
        },
        {
          start: 30000,
          end: 32000,
          rate: 48,
        },
      ],
    },
    {
      name: "North America",
      value: "NA",
      rates: [
        {
          start: 1000,
          end: 4999,
          rate: 1,
        },
        {
          start: 5000,
          end: 9999,
          rate: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          rate: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          rate: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          rate: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          rate: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          rate: 38.4,
        },
      ],
    },
    {
      name: "Europe",
      value: "EU",
      rates: [
        {
          start: 1000,
          end: 4999,
          rate: 1,
        },
        {
          start: 5000,
          end: 9999,
          rate: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          rate: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          rate: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          rate: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          rate: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          rate: 38.4,
        },
      ],
    },
    {
      name: "Australia",
      value: "AU",
      rates: [
        {
          start: 1000,
          end: 4999,
          rate: 1,
        },
        {
          start: 5000,
          end: 9999,
          rate: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          rate: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          rate: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          rate: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          rate: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          rate: 38.4,
        },
      ],
    },
    {
      name: "South America",
      value: "SA",
      rates: [
        {
          start: 1000,
          end: 4999,
          rate: 1,
        },
        {
          start: 5000,
          end: 9999,
          rate: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          rate: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          rate: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          rate: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          rate: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          rate: 38.4,
        },
      ],
    },
  ];

  // (Đơn giá 10đ = 1 Rating)
  const unitPrice = 10;

  // Tìm server hiện tại
  const selectedServer = listRates.find((s) => s.value === server);

  if (selectedServer) {
    // Lọc bonus ra chỉ thuộc phạm vi từ begin -> end point
    const relevantBonus = selectedServer.rates.filter(
      (point) => point.start <= endRating && point.end >= beginRating,
    );

    // Tỉnh tổng rate đã lọc
    const totalBonus = relevantBonus.reduce(
      (sum, bonus) => sum + bonus.rate,
      0,
    );

    // Đơn giá cho một điểm = điểm rating * đơn giá * điểm bonus
    const cost = totalBonus * (endRating - beginRating) * unitPrice;

    return cost;
  }

  return 0;
};

export default costOfPremier;
