import clsx from "clsx";

import Navbar from "../components/Layouts/Navbar";
import Introduction from "../components/Home/Introduction";
import Services from "../components/Home/Services";
import Quantity from "../components/Home/Quantity";
import Questions from "../components/Home/Questions";
import Stepup from "../components/Home/Stepup";
import Footer from "../components/Layouts/Footer";
import Information from "../components/Home/Information";
import Hero from "../components/Home/Hero";
import SEO from "../components/SEO";

const Home = () => {
  return (
    <>
      <SEO
        title="CS2Boost - The All-In-One Platform for Gamers"
        description="CS2Boost - The All-In-One Platform for Gamers"
        href="/"
      />

      <div className="h-screen bg-background">
        {/* HEADER */}
        <Navbar />

        <main
          className={clsx(
            "relative isolate overflow-hidden",
            "dark:bg-[#0F111B]",
          )}
        >
          {/* HERO */}
          <Hero />

          {/* CONTENT */}
          <div
            className={clsx(
              "space-y-20",
              "sm:space-y-40 lg:mt-20 lg:space-y-52",
            )}
          >
            {/* INFORMATION */}
            <Information />

            {/* INTRODUCTION */}
            <Introduction />

            {/* SERVICES */}
            <Services />

            {/* QUANTITY */}
            <Quantity />

            {/* QUESTIONS */}
            <Questions />

            {/* STEP UP */}
            <Stepup />
          </div>
        </main>

        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
};

export default Home;
