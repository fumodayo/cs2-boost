import { useEffect, useMemo, useState, useContext } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation"; 
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { PiUsersDuotone } from "react-icons/pi";
import {
  BillCard,
  ErrorDisplay,
  Heading,
  Helmet,
  SelectServer,
  SkeletonLoader,
} from "~/components/ui";
import { ListDetail, SelectRank } from "./components";
import { AppContext } from "~/components/context/AppContext";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";
import { IExtraOption, ICreateOrderPayload } from "~/types";
import { RootState } from "~/redux/store";
import { gameServer } from "~/constants/mode";
import timeOfWingman from "~/utils/timeOfWingman";
import getErrorMessage from "~/utils/errorHandler";
import { calculateWingmanCost } from "~/utils";
import { orderService } from "~/services/order.service";
import { rateService } from "~/services/rate.service";
import { useTranslation } from "react-i18next";
const CREATE_ORDER_KEY = "/order/create-order";
const WingmanPage = () => {
  const {
    data: configSWR,
    error,
    isLoading,
    mutate,
  } = useSWR("/rates/get-wingman-rates", rateService.getWingmanRates);
  const { t } = useTranslation("common");
  const { trigger: triggerCreateOrder, isMutating: isCreatingOrder } =
    useSWRMutation(
      CREATE_ORDER_KEY,
      (_, { arg }: { arg: { payload: ICreateOrderPayload } }) =>
        orderService.createOrder(arg.payload),
    );
  const [server, setServer] = useState<string>(
    getLocalStorage("wingman-server", ""),
  );
  const [beginRank, setBeginRank] = useState<string>(
    getLocalStorage("wingman-begin-rank", ""),
  );
  const [endRank, setEndRank] = useState<string>(
    getLocalStorage("wingman-end-rank", ""),
  );
  const { toggleLoginModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    setLocalStorage("wingman-server", server);
  }, [server]);
  useEffect(() => {
    setLocalStorage("wingman-begin-rank", beginRank);
  }, [beginRank]);
  useEffect(() => {
    setLocalStorage("wingman-end-rank", endRank);
  }, [endRank]);
  const configData = configSWR;
  const serverRanks = useMemo(() => {
    return configData?.regions.find((r) => r.value === server)?.rates ?? [];
  }, [configData, server]);
  useEffect(() => {
    if (serverRanks.length > 0) {
      const isBeginRankValid = serverRanks.some((r) => r.code === beginRank);
      if (!isBeginRankValid) setBeginRank(serverRanks[0].code);
      const beginIndex = serverRanks.findIndex(
        (r) => r.code === (isBeginRankValid ? beginRank : serverRanks[0].code),
      );
      const endIndex = serverRanks.findIndex((r) => r.code === endRank);
      if (endIndex <= beginIndex) {
        const newEndIndex = Math.min(beginIndex + 1, serverRanks.length - 1);
        setEndRank(serverRanks[newEndIndex].code);
      }
    }
  }, [serverRanks, beginRank, endRank]);
  const totalCostOfWingman = useMemo(() => {
    if (!configData || serverRanks.length === 0 || !beginRank || !endRank)
      return 0;
    return calculateWingmanCost(
      beginRank,
      endRank,
      configData.unitPrice,
      serverRanks,
    );
  }, [beginRank, endRank, configData, serverRanks]);
  const totalTimeOfWingman = useMemo(
    () => timeOfWingman({ beginRank, endRank }),
    [beginRank, endRank],
  );
  const handleCheckout = async (
    selectedOptions: IExtraOption[],
    finalCost: number,
  ) => {
    if (!currentUser?._id) {
      toast.error("Please log in to create an order.");
      toggleLoginModal();
      return;
    }
    try {
      const currentBeginRankInfo = serverRanks.find(
        (r) => r.code === beginRank,
      );
      const currentEndRankInfo = serverRanks.find((r) => r.code === endRank);
      const payload: ICreateOrderPayload = {
        price: finalCost,
        options: selectedOptions,
        total_time: totalTimeOfWingman,
        begin_rank: currentBeginRankInfo?.name,
        end_rank: currentEndRankInfo?.name,
        server: server,
        title: `Wingman Boost (${currentBeginRankInfo?.name} → ${currentEndRankInfo?.name}) - ${server}`,
        type: "wingman",
      };
      const newOrder = await triggerCreateOrder({
        payload,
      });
      if (newOrder.success) {
        toast.success("Order created successfully!");
        navigate(`/checkout/${newOrder.data}`);
      } else {
        toast.error("Order creation failed.");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  if (isLoading) return <SkeletonLoader />;
  if (error)
    return (
      <ErrorDisplay
        message="Failed to load Wingman pricing."
        onRetry={mutate}
      />
    );
  const currentBeginRankInfo = serverRanks.find((r) => r.code === beginRank);
  const currentEndRankInfo = serverRanks.find((r) => r.code === endRank);
  return (
    <>
      <Helmet title="wingman_page" />
      <div>
        <Heading
          icon={PiUsersDuotone}
          title="wingman_page_title"
          subtitle="wingman_page_subtitle"
        />
        <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
            <SelectServer server={server} setServer={setServer} />
            {server && (
              <>
                <SelectRank
                  title={t("select_rank.current_rank_title")}
                  subtitle={t("select_rank.current_rank_subtitle")}
                  ranks={serverRanks}
                  selectedValue={beginRank}
                  setSelectedValue={setBeginRank}
                />{" "}
                <SelectRank
                  title={t("select_rank.desired_rank_title")}
                  subtitle={t("select_rank.desired_rank_subtitle")}
                  ranks={serverRanks}
                  selectedValue={endRank}
                  setSelectedValue={setEndRank}
                />
              </>
            )}
            <ListDetail />
          </div>
          {configSWR && (
            <BillCard
              modeIcon={PiUsersDuotone}
              modeLabelKey="game_modes.wingman"
              serverLabelKey={server ? `server.${server}` : undefined}
              serverIcon={gameServer.find((s) => s.value === server)?.icon}
              displayItems={{
                begin: {
                  labelKey: "my_rank",
                  value: currentBeginRankInfo?.name ?? "?",
                  imageUrl: `/assets/games/counter-strike-2/wingman/${currentBeginRankInfo?.image}.png`,
                },
                end: {
                  labelKey: "desired_rank",
                  value: currentEndRankInfo?.name ?? "?",
                  imageUrl: `/assets/games/counter-strike-2/wingman/${currentEndRankInfo?.image}.png`,
                },
              }}
              baseCost={totalCostOfWingman}
              totalTime={totalTimeOfWingman}
              extraOptions={[
                { name: "Live Stream", label: "15%", value: 0.15 },
                { name: "Play with Partner", label: "10%", value: 0.1 },
              ]}
              isCheckoutDisabled={!server || totalCostOfWingman <= 0}
              onCheckout={handleCheckout}
              isLoading={isCreatingOrder}
            />
          )}
        </main>
      </div>
    </>
  );
};
export default WingmanPage;