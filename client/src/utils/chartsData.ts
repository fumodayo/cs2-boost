const getAmount = (arr: { amount: number }[] | undefined) =>
  arr?.[0]?.amount || 0;

interface ChartInputData {
  completed?: { amount: number }[];
  in_progress?: { amount: number }[];
  cancel?: { amount: number }[];
  cancelledFee?: number;
}

export const createDoughnutChartData = (
  data: ChartInputData,
  isRevenue = false,
) => {
  const labels = ["Completed", "In Progress"];
  const amounts = [getAmount(data.completed), getAmount(data.in_progress)];
  const colors = ["#28a745", "#0a6cfb"];

  if (isRevenue && data.cancelledFee) {
    labels.push("Cancelled");
    amounts.push(data.cancelledFee);
    colors.push("#dc3545");
  } else if (!isRevenue) {
    labels.push("Cancelled");
    amounts.push(getAmount(data.cancel));
    colors.push("#dc3545");
  }

  return {
    labels,
    datasets: [
      {
        label: isRevenue ? "Revenue (VND)" : "Number of Orders",
        data: amounts,
        backgroundColor: colors,
        borderColor: colors.map((c) => `${c}B3`),
        borderWidth: 1,
      },
    ],
  };
};
