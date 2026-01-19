import {
  Banner,
  Footer,
  Header,
  Helmet,
  Input,
  SubHeader,
} from "~/components/ui";
import { MarqueeComment, StepByStep } from "../HomePage/components";
import cn from "~/libs/utils";
import NewStandard from "../HomePage/components/NewStandard";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/Button";

interface INewGamePage {
  image: string;
  title: string;
}

const NewGamePage = ({ image, title }: INewGamePage) => {
  const { t } = useTranslation(["game", "common"]);

  return (
    <>
      <Helmet title={t("common:helmet.new_game_page", { gameTitle: title })} />
      <div
        className={cn(
          "relative isolate overflow-hidden bg-background",
          "dark:bg-[#0F111B]",
        )}
      >
        {/* HEADER */}
        <Header />

        {/* SUB HEADER */}
        <SubHeader />

        <main>
          {/* BANNER */}
          <Banner image={image} />

          {/* CONTENT */}
          <div className="px-2 sm:px-6 lg:px-8">
            <div className="mx-auto py-36 2xl:max-w-[1550px]">
              <div className="col-span-1 flex flex-col px-2 sm:mx-auto lg:col-span-1 2xl:max-w-[1440px]">
                <div className="flex w-full flex-wrap gap-4 lg:shrink-0">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-border bg-field p-3 text-muted-foreground shadow-sm">
                    <img
                      className="h-12 w-12 object-contain object-center"
                      src={`/assets/games/${image}/logo.png`}
                      alt="logo"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <h1 className="font-display max-w-4xl gap-4 text-lg font-semibold tracking-tight text-foreground sm:text-2xl">
                      <div className="mt-1 sm:mt-2.5" />
                      {title} {t("new_game_page.coming_soon")}
                    </h1>
                  </div>
                </div>

                <div className="grid grid-cols-1 text-foreground">
                  <p className="mt-6 max-w-xl">
                    {t("new_game_page.subtitle1")}
                  </p>
                  <p className="mt-6 max-w-xl">
                    {t("new_game_page.subtitle2")}
                  </p>
                  <div className="mb-20 mt-6">
                    <form>
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-80">
                          <Input
                            placeholder="Email Address"
                            className="block w-full rounded-md border-0 bg-field px-4 py-2.5 text-field-foreground shadow-sm ring-1 ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm"
                          />
                        </div>
                        <Button
                          variant="primary"
                          className="mt-2 rounded-md px-5 py-3 text-sm sm:ml-2 sm:mt-0 sm:py-2.5"
                          disabled
                        >
                          {t("new_game_page.notify_btn")}
                        </Button>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {t("new_game_page.description")}
                      </p>
                    </form>
                  </div>
                </div>

                {/* MARQUEE COMMENT */}
                <MarqueeComment />

                {/* NEW STANDARD */}
                <div className="relative my-32">
                  <NewStandard />
                </div>

                {/* STEP BY STEP */}
                <div className="relative mx-auto mt-32 flex w-full flex-col items-center justify-center lg:mb-32 lg:h-fit">
                  <StepByStep />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NewGamePage;