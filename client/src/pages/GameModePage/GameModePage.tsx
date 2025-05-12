import { Helmet } from "~/components/shared";
import { Heading, HowToWork, ListMode, Questions } from "./components";

const GameModePage = () => {
  return (
    <>
      <Helmet title="Counter Strike 2 Boosting, Coaching & Accounts" />
      <main>
        {/* TITLE */}
        <Heading
          logo={
            <img
              className="-ml-px h-16 w-16"
              src="/assets/games/counter-strike-2/logo.png"
              alt="logo"
            />
          }
          title="CS2 Classic Services Boost"
          subtitle="Get The Best CS2 Classic Experience!"
        />

        {/* LIST MODE */}
        <ListMode />

        {/* HOW TO WORK */}
        <HowToWork />

        {/* LIST QUESTIONS */}
        <Questions />
      </main>
    </>
  );
};

export default GameModePage;
