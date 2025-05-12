import cn from "~/libs/utils";
import { Helmet, Header, Footer } from "~/components/shared";
import {
  AskList,
  Hero,
  MarqueeComment,
  OurServices,
  QuantityClient,
  StepByStep,
  Stepup,
} from "./components";
import NewStandard from "./components/NewStandard";

const HomePage = () => {
  return (
    <>
      <Helmet title="CS2Boost - The All-In-One Platform for Gamers" />
      <div>
        {/* HEADER */}
        <Header />
        <main>
          <div
            className={cn(
              "relative isolate overflow-hidden",
              "dark:bg-[#0F111B]",
            )}
          >
            {/* HERO */}
            <Hero />
            <div
              className={cn(
                "space-y-20",
                "sm:space-y-40 lg:mt-20 lg:space-y-52",
              )}
            >
              {/* OUR SERVICES */}
              <OurServices />

              {/* STEP BY STEP */}
              <div
                className={cn(
                  "relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
                  "sm:px-6 xl:px-8",
                )}
              >
                <StepByStep />
              </div>

              {/* NEW STANDARD */}
              <div
                className={cn(
                  "relative z-20 mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4",
                  "sm:px-6 xl:px-8",
                )}
              >
                <NewStandard />
              </div>

              {/* MARQUEE COMMENTS */}
              <MarqueeComment />

              {/* QUANTITY CLIENT */}
              <QuantityClient />

              {/* ASKED QUESTIONS LIST */}
              <AskList />

              {/* STEP UP */}
              <Stepup />
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
