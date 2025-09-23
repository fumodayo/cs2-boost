import { Copy } from "~/components/shared";
import { IOrder } from "~/types";
import { formatMoney } from "~/utils";

interface AdminHeaderProps {
  order: IOrder;
}

const AdminHeader = ({ order }: AdminHeaderProps) => {
  const { title, type, server, price, boost_id } = order;

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-4 lg:shrink-0">
      <div className="flex items-center gap-x-3">
        <img
          className="size-12"
          src="/assets/games/counter-strike-2/logo.png"
          alt="logo"
        />
        <div>
          <h1 className="font-display text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          <div className="inline-flex flex-wrap items-center gap-1.5 text-sm capitalize text-muted-foreground">
            <Copy text="Id" value={boost_id}>
              #{boost_id}
            </Copy>
            <span>⸱</span>
            <div>{type?.replace("_", " ")} Boost</div>
            <span>⸱</span>
            <div>{server}</div>
            <span>⸱</span>
            <div>{formatMoney(price, "vnd")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
