export const totalCostOfPremie = (
  startingPoint: number,
  endPoint: number,
  server: string,
) => {
  const servers = [
    {
      name: "AF",
      costs: [
        {
          start: 1000,
          end: 4999,
          bonus: 1,
        },
        {
          start: 5000,
          end: 9999,
          bonus: 1,
        },
        {
          start: 10000,
          end: 14999,
          bonus: 2,
        },
        {
          start: 15000,
          end: 19999,
          bonus: 4,
        },
        {
          start: 20000,
          end: 24999,
          bonus: 8,
        },
        {
          start: 25000,
          end: 29999,
          bonus: 16,
        },
        {
          start: 30000,
          end: 32000,
          bonus: 32,
        },
      ],
    },
    {
      name: "AS",
      costs: [
        {
          start: 1000,
          end: 4999,
          bonus: 1,
        },
        {
          start: 5000,
          end: 9999,
          bonus: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          bonus: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          bonus: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          bonus: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          bonus: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          bonus: 38.4,
        },
      ],
    },
    {
      name: "CN",
      costs: [
        {
          start: 1000,
          end: 4999,
          bonus: 1,
        },
        {
          start: 5000,
          end: 9999,
          bonus: 1.5,
        },
        {
          start: 10000,
          end: 14999,
          bonus: 3,
        },
        {
          start: 15000,
          end: 19999,
          bonus: 6,
        },
        {
          start: 20000,
          end: 24999,
          bonus: 12,
        },
        {
          start: 25000,
          end: 29999,
          bonus: 24,
        },
        {
          start: 30000,
          end: 32000,
          bonus: 48,
        },
      ],
    },
    {
      name: "NA",
      costs: [
        {
          start: 1000,
          end: 4999,
          bonus: 1,
        },
        {
          start: 5000,
          end: 9999,
          bonus: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          bonus: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          bonus: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          bonus: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          bonus: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          bonus: 38.4,
        },
      ],
    },
    {
      name: "EU",
      costs: [
        {
          start: 1000,
          end: 4999,
          bonus: 1,
        },
        {
          start: 5000,
          end: 9999,
          bonus: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          bonus: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          bonus: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          bonus: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          bonus: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          bonus: 38.4,
        },
      ],
    },
    {
      name: "AU",
      costs: [
        {
          start: 1000,
          end: 4999,
          bonus: 1,
        },
        {
          start: 5000,
          end: 9999,
          bonus: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          bonus: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          bonus: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          bonus: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          bonus: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          bonus: 38.4,
        },
      ],
    },
    {
      name: "SA",
      costs: [
        {
          start: 1000,
          end: 4999,
          bonus: 1,
        },
        {
          start: 5000,
          end: 9999,
          bonus: 1.2,
        },
        {
          start: 10000,
          end: 14999,
          bonus: 2.4,
        },
        {
          start: 15000,
          end: 19999,
          bonus: 4.8,
        },
        {
          start: 20000,
          end: 24999,
          bonus: 9.6,
        },
        {
          start: 25000,
          end: 29999,
          bonus: 19.2,
        },
        {
          start: 30000,
          end: 32000,
          bonus: 38.4,
        },
      ],
    },
  ];

  const moneyPerPoint = 5; // Tính theo 5 vnd cho mỗi điểm

  const selectedServer = servers.find((s) => s.name === server);
  if (selectedServer) {
    // Lọc ra các khoảng giá trị thuộc phạm vi từ startingPoint đến endPoint
    const relevantCosts = selectedServer.costs.filter(
      (cost) => cost.start <= endPoint && cost.end >= startingPoint,
    );

    // Tính tổng bonus từ các khoảng giá trị đã lọc
    const totalBonus = relevantCosts.reduce((sum, cost) => sum + cost.bonus, 0);

    // Tính totalCost bằng cách nhân totalBonus với độ chênh lệch giữa endPoint và startingPoint
    const totalCost = totalBonus * (endPoint - startingPoint) * moneyPerPoint;
    return totalCost;
  }
  
  return -1; // Trả về -1 nếu không tìm thấy server
};
