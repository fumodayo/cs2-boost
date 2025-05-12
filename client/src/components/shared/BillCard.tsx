import { GoClockFill } from "react-icons/go";
import { RxGlobe } from "react-icons/rx";
import Switch from "../@radix-ui/Switch";
import { Button } from "./Button";
import { useLocation, useNavigate } from "react-router-dom";
import Chip from "./Chip";
import { formatMoney } from "~/utils";
import { gameMode, gameServer } from "~/constants/mode";
import { useContext, useMemo, useState } from "react";
import { IconType } from "react-icons";
import { listOfRanks } from "~/constants/games";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext";
import { useExchangeMoney } from "~/hooks/useExchangeMoney";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { axiosAuth } from "~/axiosAuth";
import toast from "react-hot-toast";

const options = [
  {
    name: "Stream",
    label: "15%",
    value: 0.15,
  },
  {
    name: "Play with Partner (Duo)",
    label: "10%",
    value: 0.1,
  },
];

interface IOptionProps {
  name: string;
  label: string;
  value: number;
}

const Option = ({
  name,
  label,
  isChecked,
  onToggle,
}: IOptionProps & { isChecked: boolean; onToggle: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center justify-between gap-1">
        <label className="text-sm font-semibold capitalize">
          {t(`BillCard.options.${name}`)}
        </label>
        <Chip>+ {label}</Chip>
      </div>
      <div className="flex items-center justify-between">
        <Switch checked={isChecked} onCheckedChange={onToggle} />
      </div>
    </div>
  );
};

const Mode = ({ icon: Icon, label }: { icon: IconType; label: string }) => {
  const { t } = useTranslation();
  return (
    <div className="mx-1 my-2 flex items-center space-x-2">
      <Icon className="text-blue-600" size={20} />
      <span className="whitespace-nowrap rounded-md bg-accent px-3 py-1 text-sm text-muted-foreground">
        {t(`Globals.GameMode.${label}`)}
      </span>
    </div>
  );
};

const ModeServer = ({
  icon: Icon,
  label,
}: {
  icon: IconType;
  label: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className="mx-1 my-2 flex items-center space-x-2">
      <Icon className="text-blue-600" size={20} />
      <span className="whitespace-nowrap rounded-md bg-accent px-3 py-1 text-sm text-muted-foreground">
        {t(`Globals.Server.${label}`)}
      </span>
    </div>
  );
};

interface IBillCardProps {
  beginText?: string;
  endText?: string;
  beginExp?: number;
  endExp?: number;
  beginRating?: number;
  endRating?: number;
  beginRank?: string;
  endRank?: string;
  cost?: number;
  totalTime?: number;
  server?: string;
}

const BillCard = ({
  cost,
  totalTime,
  beginText,
  endText,
  beginExp,
  endExp,
  beginRating,
  endRating,
  beginRank,
  endRank,
  server,
}: IBillCardProps) => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const { currency, toggleLoginModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);

  const { pathname } = useLocation();
  const mode = gameMode.find((game) => game.path === pathname);

  // Tìm kiếm server trong server list
  const currentServer = gameServer.find((game) => game.value === server);

  // Tìm kiếm rank trong rank list
  const currentBeginRank = listOfRanks.find((rank) => rank.value === beginRank);
  const currentEndRank = listOfRanks.find((rank) => rank.value === endRank);

  const [optionList, setOptionList] = useState<IOptionProps[]>([]);

  // Nếu toggle on switch nào thì option sẽ được thêm vào option list và ngược lại
  const handleToggle = (option: IOptionProps) => {
    setOptionList((prev) =>
      prev.some((item) => item.name === option.name)
        ? prev.filter((item) => item.name !== option.name)
        : [...prev, option],
    );
  };

  // Tổng số tiền (cost + bonus cost) theo option list
  const totalCost = useMemo(() => {
    if (cost) {
      const bonusCost = optionList.reduce(
        (acc, option) => acc + cost * option.value,
        0,
      );
      // Làm tròn đến hàng 1000
      return Math.round((cost + bonusCost) / 1000) * 1000;
    }
    return 0;
  }, [cost, optionList]);

  const exchangeMoney = useExchangeMoney(totalCost);

  const handleCreateOrder = async () => {
    if (!currentUser) {
      toggleLoginModal();
    } else {
      try {
        setLoading(true);
        const newOrder = {
          price: totalCost,
          options: optionList,
          totalTime,
          begin_exp: beginExp,
          end_exp: endExp,
          begin_rating: beginRating,
          end_rating: endRating,
          begin_rank: currentBeginRank?.name,
          end_rank: currentEndRank?.name,
          server: currentServer?.label ?? "global",
          title: `${mode?.label} (${currentBeginRank?.name || ""}${beginExp ?? ""}${beginRating ?? ""} → ${currentEndRank?.name || ""}${endExp ?? ""}${endRating ?? ""}) - ${currentServer?.label ?? "global"}`,
          type: mode?.label.toLowerCase().replace(" ", "_"),
        };

        const { data } = await axiosAuth.post(
          `/order/create-order/${currentUser?._id}`,
          newOrder,
        );

        if (data.success) {
          const { order_id } = data;
          navigator(`/checkout/${order_id}`);
        } else {
          toast.error("Order failed");
        }
      } catch (e) {
        toast.error("Order failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="gap-5 lg:col-span-2 xl:col-span-2">
      <div className="w-full max-w-[540px] rounded-lg bg-card p-6 shadow">
        <p className="text-center text-lg font-semibold text-foreground">
          {t("BillCard.header")}
        </p>
        {server ? (
          <div className="-mx-6 my-4 bg-accent py-3 text-center text-muted-foreground">
            <div className="flex justify-center">
              <span className="mx-1 font-bold text-foreground md:mx-4">
                {t(`Globals.label.${beginText}`)}
              </span>
              <p className="w-4">{beginExp}</p>
              <p className="w-4">{beginRating}</p>
              {currentBeginRank && (
                <img
                  className="h-full w-14"
                  src={`/assets/games/counter-strike-2/wingman/${currentBeginRank.image}.png`}
                  alt={currentBeginRank.name}
                />
              )}
              <span className="ml-8">{"->"}</span>
              <span className="mx-1 font-bold text-foreground md:mx-4">
                {t(`Globals.label.${endText}`)}
              </span>
              <p className="w-4">{endExp}</p>
              <p className="w-4">{endRating}</p>
              {currentEndRank && (
                <img
                  className="h-full w-14"
                  src={`/assets/games/counter-strike-2/wingman/${currentEndRank.image}.png`}
                  alt={currentEndRank.name}
                />
              )}
            </div>
          </div>
        ) : (
          <p className="my-8 text-center text-warning">{t("BillCard.title")}</p>
        )}

        {/* OPTIONS */}
        {server && (
          <div className="my-4 max-w-lg rounded-lg bg-card">
            <h4 className="mb-8 text-center text-sm text-muted-foreground">
              {t("BillCard.subtitle")}
            </h4>
            {options.map((option) => (
              <Option
                key={option.name}
                {...option}
                isChecked={optionList.some((item) => item.name === option.name)}
                onToggle={() => handleToggle(option)}
              />
            ))}
          </div>
        )}

        {/* TOTAL TIME */}
        {server && totalTime && totalTime > 0 ? (
          <div className="-mx-6 mb-4 flex items-center justify-center bg-accent py-3 text-center text-sm font-bold text-muted-foreground">
            <GoClockFill className="mr-2" size={18} /> {t("BillCard.time1")}:
            <span className="font-bold">
              ~{" "}
              {totalTime && (totalTime <= 60 ? 1 : Math.floor(totalTime / 60))}{" "}
              {t("BillCard.time2")}
            </span>
          </div>
        ) : (
          ""
        )}

        {/* MODES */}
        {mode && server && (
          <div className="my-8 flex flex-wrap gap-2">
            <Mode {...mode} />
            {currentServer && <ModeServer {...currentServer} />}
          </div>
        )}

        {/* TOTAL COST */}
        <div className="mt-6 flex items-end justify-between">
          <p className="text-lg text-muted-foreground">
            {t("BillCard.price")}:
          </p>
          {exchangeMoney && exchangeMoney > 0 ? (
            <div className="flex flex-row items-end gap-2">
              <span className="bg-gradient-to-l from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold tracking-tight text-transparent">
                {formatMoney(exchangeMoney, currency)}
              </span>
            </div>
          ) : (
            ""
          )}
        </div>
        <Button
          disabled={
            !server ||
            loading ||
            totalCost <= 0
          }
          variant="primary"
          className="text-md mt-4 w-full rounded-md py-2 font-semibold text-primary-foreground hover:!bg-blue-700"
          onClick={handleCreateOrder}
        >
          {t("BillCard.btn")} →
        </Button>
        <div className="mt-4 flex items-center justify-center text-center text-sm font-semibold text-muted-foreground">
          <RxGlobe className="mr-1" />
          {t("BillCard.description")}
        </div>
      </div>
    </div>
  );
};

export default BillCard;
