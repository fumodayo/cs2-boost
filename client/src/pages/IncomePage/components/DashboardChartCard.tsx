import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardChartCardProps {
  title: string;
  chartData: ChartData<"doughnut", number[], string>;
}

const DashboardChartCard = ({ title, chartData }: DashboardChartCardProps) => {
  return (
    <div className="h-full rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      <div className="relative h-64 w-full">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  boxWidth: 12,
                  font: {
                    size: 14,
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default DashboardChartCard;