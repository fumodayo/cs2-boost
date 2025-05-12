import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  ChartOptions,
  BarController,
} from "chart.js";
import { formatMoney } from "~/utils";
import { useNavigate } from "react-router-dom";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { IconType } from "react-icons";
import { IOrderProps } from "~/types";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  BarController,
);

interface ItemStackedProps {
  status?: string;
  amount?: number;
  createdAt?: string;
  price?: number;
}

const optionsTable: ChartOptions = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Chart.js Bar Chart " },
  },
};
const RecordItem = ({ status, price, createdAt }: ItemStackedProps) => {
  return (
    <div className="px-0 pt-0">
      <div className="px-4 py-4 sm:col-span-3 sm:grid-cols-3 sm:px-0">
        <dt className="flex items-center justify-start gap-x-4 text-sm font-medium capitalize text-foreground">
          <div className="min-w-[6rem]">
            <div className="flex max-w-max items-center justify-center rounded-xl bg-primary px-4 py-1 font-bold text-primary-foreground">
              {status}
            </div>
          </div>
          {createdAt && new Date(createdAt).toLocaleDateString("en-GB")}
        </dt>
        <dd className="flex justify-center gap-x-2 text-sm font-bold leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
          {price && formatMoney(price, "vnd")}
        </dd>
      </div>
    </div>
  );
};

interface IStackedProps {
  title: string;
  icon: IconType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  records: IOrderProps[];
  direct: string;
}
const Stacked = ({
  title,
  data,
  records,
  direct,
  icon: Icon,
}: IStackedProps) => {
  const navigator = useNavigate();

  return (
    <div className="border border-border bg-card shadow-sm sm:rounded-xl">
      <div className="flex items-center justify-center border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
        <h3 className="font-display flex items-center justify-center font-semibold">
          <Icon className="mr-2 text-success" />
          {title}
          (20)
        </h3>
      </div>
      <div className="px-0 py-5 sm:px-6">
        <Chart type="bar" options={optionsTable} data={data} />
      </div>
      <div className="border-border bg-card shadow-sm sm:rounded-xl">
        <div className="border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
          <h3 className="font-display pb-2 font-semibold">Recent Order</h3>
          {records?.map((item, idx) => (
            <RecordItem key={idx} {...item} />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center border-t border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
        <span
          onClick={() => navigator(direct)}
          className="secondary flex cursor-pointer items-center justify-center text-sm font-medium hover:underline"
        >
          View more
          <MdKeyboardDoubleArrowDown
            className="text-muted-foreground/50"
            size={18}
          />
        </span>
      </div>
    </div>
  );
};

export default Stacked;
