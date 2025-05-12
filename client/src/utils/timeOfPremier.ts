type ITimeOfPremier = {
  beginRating: number;
  endRating: number;
};

const timeOfPremier = ({ beginRating, endRating }: ITimeOfPremier) => {
  // Thời gian cho mỗi trận: 40 phút
  const totalTimePerMatch = 40;

  const bonusPerMatch = [
    { start: 1000, end: 4999, bonus: 500 },
    { start: 5000, end: 9999, bonus: 500 },
    { start: 10000, end: 14999, bonus: 400 },
    { start: 15000, end: 19999, bonus: 300 },
    { start: 20000, end: 24999, bonus: 200 },
    { start: 25000, end: 29999, bonus: 100 },
    { start: 30000, end: 32000, bonus: 50 },
  ];

  let totalTime = 0;

  for (let i = 0; i < bonusPerMatch.length; i++) {
    const { start, end, bonus } = bonusPerMatch[i];

    // Kiểm tra khoảng điểm hiện tại có liên quan đến đoạn từ beginRating đến endRating
    if (endRating < start || beginRating > end) {
      continue; // Bỏ qua nếu khoảng điểm không nằm trong phạm vi
    }

    // Xác định điểm bắt đầu và kết thúc trong khoảng điểm hiện tại
    const effectiveStart = Math.max(beginRating, start);
    const effectiveEnd = Math.min(endRating, end);

    // Tính điểm cần thêm trong khoảng điểm hiện tại
    const pointsToGain = effectiveEnd - effectiveStart;

    // Tính số trận cần để thêm đủ điểm
    const matches = Math.ceil(pointsToGain / bonus);

    // Tính thời gian cần thiết (mỗi trận 40 phút)
    totalTime += matches * totalTimePerMatch;
  }

  return totalTime;
};

export default timeOfPremier;
