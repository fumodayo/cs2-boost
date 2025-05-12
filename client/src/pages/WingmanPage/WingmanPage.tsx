import { BillCard, Helmet, SelectServer } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { PiUsersDuotone } from "react-icons/pi";
import { ListDetail, SelectRank } from "./components";
import { MarqueeComment } from "../HomePage/components";
import { useEffect, useMemo, useState } from "react";
import { getLocalStorage, setLocalStorage } from "~/utils/localStorage";
import costOfWingman from "~/utils/costOfWingman";
import timeOfWingman from "~/utils/timeOfWingman";

const WingmanPage = () => {
  const [server, setServer] = useState(getLocalStorage("wingman-server", ""));

  useEffect(() => {
    setLocalStorage("wingman-server", server);
  }, [server]);

  const [beginRank, setBeginRank] = useState<string>(
    getLocalStorage("wingman-begin-rank", "silver_2"),
  );
  const [endRank, setEndRank] = useState<string>(
    getLocalStorage("wingman-end-rank", "glob_nova_2"),
  );

  useEffect(() => {
    setLocalStorage("wingman-begin-rank", beginRank);
    setLocalStorage("wingman-end-rank", endRank);
  }, [beginRank, endRank]);

  // Tổng số tiền cày wingman (đơn giá 10000đ = 1 Point)
  const totalCostOfWingman = useMemo(() => {
    return costOfWingman({ beginRank, endRank, server });
  }, [beginRank, endRank, server]);

  // Tổng số thời gian để cày wingman
  const totalTimeOfWingman = useMemo(() => {
    return timeOfWingman({ beginRank, endRank });
  }, [beginRank, endRank]);

  return (
    <>
      <Helmet title="CS2 Power Wingman Boost" />
      <div>
        <Heading
          icon={PiUsersDuotone}
          title="Counter Strike 2 Wingman"
          subtitle="Maximize Your Rank In No Time!"
        />
        <main className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-4 xl:grid-cols-5 xl:gap-8">
          {/* CONTENT */}
          <div className="space-y-4 lg:col-span-2 lg:space-y-6 xl:col-span-3">
            {/* CONTROLLER */}
            <SelectServer server={server} setServer={setServer} />
            {server && (
              <>
                <SelectRank
                  title="Current Rank"
                  subtitle="Select your current tier and division."
                  selectedValue={beginRank}
                  setSelectedValue={setBeginRank}
                />
                <SelectRank
                  title="Desired Rank"
                  subtitle="Select your desired tier and division."
                  selectedValue={endRank}
                  setSelectedValue={setEndRank}
                />
              </>
            )}

            {/* DETAILS */}
            <ListDetail />
          </div>
          {/* CHECKOUT */}
          <BillCard
            beginText="My Rank"
            endText="Desired Rank"
            beginRank={beginRank}
            endRank={endRank}
            cost={totalCostOfWingman}
            totalTime={totalTimeOfWingman}
            server={server}
          />
        </main>

        {/* MARQUEE COMMENT */}
        <MarqueeComment />
      </div>
    </>
  );
};

export default WingmanPage;
