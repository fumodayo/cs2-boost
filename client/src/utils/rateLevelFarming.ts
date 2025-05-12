type IRateLevelFarming = {
  beginExp: number;
  endExp: number;
};

const rateLevelFarming = ({ beginExp, endExp }: IRateLevelFarming) => {
  let totalEXP = 0;

  // EXP cho mỗi trận đấu
  const EXPPerMatch = 60;

  // Thời gian tối đa cho mỗi trận
  const timePerMatch = 0.5;

  // Tỉ lệ bonus EXP theo số EXP đã cày trong 1 tuần
  const approximateGainedEXP = [
    { start: 0, end: 4499, bonus: 4 },
    { start: 4500, end: 7499, bonus: 2 },
    { start: 7500, end: 11166, bonus: 1 },
    { start: 11167, end: 15000, bonus: 0.175 },
  ];

  for (const range of approximateGainedEXP) {
    // Kiểm tra nếu khoảng EXP cần cày nằm trong khoảng hiện tại
    if (beginExp <= range.end && endExp >= range.start) {
      const effectiveBegin = Math.max(beginExp, range.start); // Điểm bắt đầu của khoảng hiện tại
      const effectiveEnd = Math.min(endExp, range.end); // Điểm kết thúc của khoảng hiện tại

      const EXPInRange =
        (effectiveEnd - effectiveBegin + 1) * (range.bonus + 1); // Tính EXP trong khoảng này

      totalEXP += EXPInRange; // Cộng dồn EXP từ các khoảng
    }
  }

  // Tính tổng thời gian dựa trên số trận và thời gian mỗi trận
  return Math.round(totalEXP / EXPPerMatch) * timePerMatch;
};

export default rateLevelFarming;
