import { BillCard, Helmet, SelectServer } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { PiUsersThreeDuotone } from "react-icons/pi";
import { ListDetail, Select } from "./components";
import { MarqueeComment } from "../HomePage/components";
import { useEffect, useMemo, useState } from "react";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";
import costOfPremier from "~/utils/costOfPremier";
import timeOfPremier from "~/utils/timeOfPremier";

const PremierPage = () => {
  const defaultRange = [10000, 15000];
  const [range, setRange] = useState<number[]>(
    getLocalStorage("premier-range", defaultRange),
  );
  const [beginRating, endRating] = range;

  useEffect(() => {
    setLocalStorage("premier-range", range);
  }, [range]);

  const [server, setServer] = useState(getLocalStorage("premier-server", ""));

  useEffect(() => {
    setLocalStorage("premier-server", server);
  }, [server]);

  // Tổng số tiền cày premier (đơn giá 10đ = 1 Rating)
  const totalCostOfPremier = useMemo(() => {
    return costOfPremier({ beginRating, endRating, server });
  }, [beginRating, endRating, server]);

  // Tổng số thời gian để cày rank premier
  const totalTimeOfPremier = useMemo(() => {
    return timeOfPremier({ beginRating, endRating });
  }, [beginRating, endRating]);

  return (
    <>
      <Helmet title="CS2 Power Premier Boost" />
      <div>
        <Heading
          icon={PiUsersThreeDuotone}
          title="Counter Strike 2 Premier"
          subtitle="Maximize Your Rank In No Time!"
        />
        <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          {/* CONTENT */}
          <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
            {/* CONTROLLER */}
            <SelectServer server={server} setServer={setServer} />
            {server && <Select range={range} setRange={setRange} />}

            {/* DETAILS */}
            <ListDetail />
          </div>

          {/* CHECKOUT */}
          <BillCard
            beginText="My Rating"
            endText="Desired Rating"
            beginRating={beginRating}
            endRating={endRating}
            cost={totalCostOfPremier}
            totalTime={totalTimeOfPremier}
            server={server}
          />
        </main>

        {/* MARQUEE COMMENT */}
        <MarqueeComment />
      </div>
    </>
  );
};

export default PremierPage;
