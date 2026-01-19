import { Heading, Helmet } from "~/components/ui";
import { HowToWork, ListMode, Questions } from "./components";

const GameModePage = () => {
  return (
    <>
      <Helmet title="game_mode_page" />
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
          title="game_mode_page_title"
          subtitle="game_mode_page_subtitle"
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