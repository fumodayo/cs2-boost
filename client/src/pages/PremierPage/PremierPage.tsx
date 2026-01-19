import { useEffect, useMemo, useState, useContext } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  BillCard,
  ErrorDisplay,
  Heading,
  Helmet,
  SelectServer,
  SkeletonLoader,
} from "~/components/ui";
import { ListDetail, Select } from "./components";
import { AppContext } from "~/components/context/AppContext";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";
import timeOfPremier from "~/utils/timeOfPremier";
import { RootState } from "~/redux/store";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { gameServer } from "~/constants/mode";
import getErrorMessage from "~/utils/errorHandler";
import { IExtraOption, ICreateOrderPayload } from "~/types";
import { calculatePremierCost } from "~/utils";
import { orderService } from "~/services/order.service";
import { rateService } from "~/services/rate.service";

const CREATE_ORDER_KEY = "/order/create-order";

const PremierPage = () => {
  const {
    data: configSWR,
    error,
    isLoading,
    mutate,
  } = useSWR("/rates/get-premier-rates", rateService.getPremierRates);

  const { trigger: triggerCreateOrder, isMutating: isCreatingOrder } =
    useSWRMutation(
      CREATE_ORDER_KEY,
      (_, { arg }: { arg: { payload: ICreateOrderPayload } }) =>
        orderService.createOrder(arg.payload),
    );

  const [range, setRange] = useState<number[]>(
    getLocalStorage("premier-range", [10000, 15000]),
  );
  const [beginRating, endRating] = range;
  const [server, setServer] = useState<string>(
    getLocalStorage("premier-server", ""),
  );

  const { toggleLoginModal } = useContext(AppContext);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    setLocalStorage("premier-range", range);
  }, [range]);
  useEffect(() => {
    setLocalStorage("premier-server", server);
  }, [server]);

  const configData = configSWR;

  const totalCostOfPremier = useMemo(() => {
    if (!configData || !server) return 0;
    const selectedServerRates = configData.regions.find(
      (s) => s.value === server,
    )?.rates;
    if (!selectedServerRates) return 0;
    return calculatePremierCost(
      beginRating,
      endRating,
      configData.unitPrice,
      selectedServerRates,
    );
  }, [beginRating, endRating, server, configData]);

  const totalTimeOfPremier = useMemo(
    () => timeOfPremier({ beginRating, endRating }),
    [beginRating, endRating],
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
        total_time: totalTimeOfPremier,
        begin_rating: beginRating,
        end_rating: endRating,
        server: server,
        title: `Premier Boost (${beginRating} → ${endRating}) - ${server}`,
        type: "premier",
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
      <ErrorDisplay message="Failed to load pricing data." onRetry={mutate} />
    );

  return (
    <>
      <Helmet title="premier_page" />
      <div>
        <Heading
          icon={PiUsersThreeDuotone}
          title="premier_page_title"
          subtitle="premier_page_subtitle"
        />
        <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
            <SelectServer server={server} setServer={setServer} />
            {server && <Select range={range} setRange={setRange} />}
            <ListDetail />
          </div>
          <BillCard
            modeIcon={PiUsersThreeDuotone}
            modeLabelKey="game_modes.level_farming"
            serverLabelKey={server ? `server.${server}` : undefined}
            serverIcon={gameServer.find((s) => s.value === server)?.icon}
            displayItems={{
              begin: {
                labelKey: "my_rating",
                value: beginRating.toLocaleString(),
              },
              end: {
                labelKey: "desired_rating",
                value: endRating.toLocaleString(),
              },
            }}
            baseCost={totalCostOfPremier}
            totalTime={totalTimeOfPremier}
            extraOptions={[
              { name: "Live Stream", label: "15%", value: 0.15 },
              { name: "Play with Partner", label: "10%", value: 0.1 },
            ]}
            isCheckoutDisabled={!server || totalCostOfPremier <= 0}
            onCheckout={handleCheckout}
            isLoading={isCreatingOrder}
          />
        </main>
      </div>
    </>
  );
};
export default PremierPage;