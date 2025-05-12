import { FaPlus } from "react-icons/fa6";
import { Heading } from "../GameModePage/components";
import { BillCard, Helmet } from "~/components/shared";
import { ListBoard, ListDetail, Select } from "./components";
import { MarqueeComment } from "../HomePage/components";
import { useEffect, useMemo, useState } from "react";
import { rateLevelFarming } from "~/utils";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";

const LevelFarmingPage = () => {
  const defaultRange = [0, 5000];

  const [range, setRange] = useState<number[]>(
    getLocalStorage("level-farming", defaultRange),
  );
  const [beginExp, endExp] = range;

  useEffect(() => {
    setLocalStorage("level-farming", range);
  }, [range]);

  // Thời gian farm exp (tính theo phút)
  const totalTimeOfLevelFarming = useMemo(() => {
    return rateLevelFarming({ beginExp, endExp });
  }, [beginExp, endExp]);

  // Tổng số tiền farm exp (đơn giá 10đ = 1 EXP)
  const totalCostOfLevelFarming = useMemo(() => {
    return (endExp - beginExp) * 10;
  }, [beginExp, endExp]);

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
          {/* CONTENT */}
          <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
            {/* CONTROLLER */}
            <Select range={range} setRange={setRange} />
            <ListDetail />
            <ListBoard />
          </div>

          {/* CHECKOUT */}
          <BillCard
            beginText="My Exp"
            endText="Desired Exp"
            beginExp={beginExp}
            endExp={endExp}
            cost={totalCostOfLevelFarming}
            totalTime={totalTimeOfLevelFarming}
            server="world"
          />
        </main>

        {/* MARQUEE COMMENT */}
        <MarqueeComment />
      </div>
    </>
  );
};

export default LevelFarmingPage;
