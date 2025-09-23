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
  Helmet,
  SkeletonLoader,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
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

  const configData = useMemo(() => configSWR, [configSWR]);

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
      <Helmet title="CS2 Power Leveling Boost" />
      <div>
        <Heading
          icon={FaPlus}
          title="Counter Strike 2 Leveling"
          subtitle="Maximize Your Level In No Time!"
        />
        <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
            {configData && <Select range={range} setRange={setRange} />}
            <ListDetail />
            <ListBoard />
          </div>
          {configData && (
            <BillCard
              serverLabel="global"
              modeIcon={FaPlus}
              modeLabel="Level Farming"
              displayItems={{
                begin: { label: "My XP", value: beginExp.toLocaleString() },
                end: { label: "Desired XP", value: endExp.toLocaleString() },
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
