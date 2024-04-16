import type { ChartData, ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

import UserPage from "../../components/Layouts/UserPage";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const options: ChartOptions<"bar"> = {
  scales: {
    y: {
      position: "left",
    },
    y2: {
      position: "right",
    },
  },
};

const data: ChartData<"bar" | "line", number[], unknown> = {
  labels,
  datasets: [
    {
      type: "line" as const,
      label: "Income",
      borderColor: "rgb(255, 99, 132)",
      borderWidth: 2,
      fill: false,
      data: labels.map(() => faker.datatype.number({ min: 0, max: 10000000 })),
      yAxisID: "y2",
    },
    {
      type: "bar" as const,
      label: "Order",
      backgroundColor: "rgb(75, 192, 192)",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: "white",
      borderWidth: 2,
      yAxisID: "y",
    },
  ],
};

const Income = () => {
  return (
    <UserPage>
      <div className="container">
        <Chart type="bar" options={options} data={data} />
        Income
      </div>
    </UserPage>
  );
};

export default Income;
