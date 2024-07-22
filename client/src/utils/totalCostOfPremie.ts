export const totalCostOfPremie = (
  unit_price,
  price_list,
  startingPoint: number,
  endPoint: number,
  server: string,
) => {
  if (!price_list) {
    return -1;
  }

  const selectedServer = price_list.find((s) => s.value === server);
  if (selectedServer) {
    // Lọc ra các khoảng giá trị thuộc phạm vi từ startingPoint đến endPoint
    const relevantCosts = selectedServer.costs.filter(
      (cost) => cost.start <= endPoint && cost.end >= startingPoint,
    );

    // Tính tổng bonus từ các khoảng giá trị đã lọc
    const totalBonus = relevantCosts.reduce((sum, cost) => sum + cost.bonus, 0);

    // Tính totalCost bằng cách nhân totalBonus với độ chênh lệch giữa endPoint và startingPoint
    const totalCost = totalBonus * (endPoint - startingPoint) * unit_price;
    return totalCost;
  }

  return -1; // Trả về -1 nếu không tìm thấy server
};
