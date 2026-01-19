import { useEffect, useMemo, useState, useContext } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import {
  BillCard,
  ErrorDisplay,
  Heading,
  Helmet,
  SkeletonLoader,
} from "~/components/ui";
import { ListBoard, ListDetail, Select } from "./components";
import { AppContext } from "~/components/context/AppContext";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";
import getErrorMessage from "~/utils/errorHandler";
import calculateLevelFarmingCost from "~/utils/rateLevelFarming";
import { IExtraOption, ICreateOrderPayload } from "~/types";
import { RootState } from "~/redux/store";
import { orderService } from "~/services/order.service";
import { rateService } from "~/services/rate.service";

const CREATE_ORDER_KEY = "/order/create-order";

const LevelFarmingPage = () => {
  const {
    data: configSWR,
    error,
    isLoading,
    mutate,
  } = useSWR(
    "/rates/get-level-farming-config",
    rateService.getLevelFarmingConfig,
  );

  const { trigger: triggerCreateOrder, isMutating: isCreatingOrder } =
    useSWRMutation(
      CREATE_ORDER_KEY,
      (_, { arg }: { arg: { payload: ICreateOrderPayload } }) =>
        orderService.createOrder(arg.payload),
    );

  const [range, setRange] = useState<number[]>(
    getLocalStorage("level-farming", [0, 5000]),
  );
  const [beginExp, endExp] = range;

  const { toggleLoginModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalStorage("level-farming", range);
  }, [range]);

  const configData = configSWR;

  const totalCostOfLevelFarming = useMemo(() => {
    if (!configData?.unitPrice) return 0;
    const { unitPrice } = configData;
    return (endExp - beginExp) * unitPrice;
  }, [beginExp, endExp, configData]);

  const totalTimeOfLevelFarming = useMemo(
    () => calculateLevelFarmingCost({ beginExp, endExp }),
    [beginExp, endExp],
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
      const payload: ICreateOrderPayload = {
        price: finalCost,
        options: selectedOptions,
        total_time: totalTimeOfLevelFarming,
        begin_exp: beginExp,
        end_exp: endExp,
        server: "Global",
        title: `Level Farming (${beginExp.toLocaleString()} XP → ${endExp.toLocaleString()} XP)`,
        type: "level_farming",
      };

      const newOrder = await triggerCreateOrder({
        payload,
      });

      if (newOrder.success) {
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
        message="Failed to load Level Farming pricing. Please try again."
        onRetry={mutate}
      />
    );

  return (
    <>
      <Helmet title="level_farming_page" />
      <div>
        <Heading
          icon={FaPlus}
          title="level_farming_page_title"
          subtitle="level_farming_page_subtitle"
        />
        <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
            {configData && <Select range={range} setRange={setRange} />}
            <ListDetail />
            <ListBoard />
          </div>
          {configData && (
            <BillCard
              serverLabelKey="servers.global"
              modeIcon={FaPlus}
              modeLabelKey="game_modes.level_farming"
              displayItems={{
                begin: { labelKey: "my_exp", value: beginExp.toLocaleString() },
                end: {
                  labelKey: "desired_exp",
                  value: endExp.toLocaleString(),
                },
              }}
              baseCost={totalCostOfLevelFarming}
              totalTime={totalTimeOfLevelFarming}
              extraOptions={[
                { name: "Live Stream", label: "15%", value: 0.15 },
              ]}
              isCheckoutDisabled={totalCostOfLevelFarming <= 0}
              onCheckout={handleCheckout}
              isLoading={isCreatingOrder}
            />
          )}
        </main>
      </div>
    </>
  );
};

export default LevelFarmingPage;