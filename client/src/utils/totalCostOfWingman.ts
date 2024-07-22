export const totalCostOfWingman = (
  price_list,
  currentRank: string,
  desiredRank: string,
  server: string,
): number => {
  if (!price_list) {
    return -1;
  }
  // Lấy thông tin về server cụ thể
  const selectedServer = price_list.find((s) => s.value === server);
  console.log({selectedServer});

  if (selectedServer) {
    // Lấy index của currentRank và desiredRank trong mảng ranks
    const currentIndex = selectedServer.costs.findIndex(
      (rank) => rank.code === currentRank,
    );
    const desiredIndex = selectedServer.costs.findIndex(
      (rank) => rank.code === desiredRank,
    );

    if (currentIndex !== -1 && desiredIndex !== -1) {
      // Tính toán giá trị dựa trên bonus
      const currentBonus = selectedServer.costs
        .slice(0, currentIndex + 1)
        .reduce((sum, rank) => sum + rank.bonus, 0);
      const desiredBonus = selectedServer.costs
        .slice(0, desiredIndex + 1)
        .reduce((sum, rank) => sum + rank.bonus, 0);

      // Kiểm tra giá trị của currentBonus và desiredBonus
      if (desiredBonus > 0 && currentBonus > 0) {
        // Tính toán tổng chi phí dựa trên công thức đã cung cấp
        const totalCost = (desiredBonus - currentBonus) * 10000;
        return totalCost;
      }
    }
  }
  return -1; // Trả về -1 nếu không tìm thấy server
};
