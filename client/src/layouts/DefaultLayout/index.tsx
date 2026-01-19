import { Outlet } from "react-router-dom";
import {
  Banner,
  Footer,
  Header,
  SubHeader,
  SubSidebar,
} from "~/components/ui";
import { Navigation } from "~/pages/GameModePage/components";
import NewStandard from "~/pages/HomePage/components/NewStandard";

const DefaultLayout = () => {
  return (
    <div>
      <Header />
      <SubHeader />
      <div>
        {/* BANNER */}
        <Banner image="counter-strike-2" />
        <div className="px-2 sm:px-6 lg:px-8">
          <div className="mx-auto py-36 2xl:max-w-[1550px]">
            <div className="col-span-1 px-2 lg:col-span-1">
              <div className="mx-auto max-w-[1550px]">
                <div className="flex grid-cols-1 gap-4 lg:grid lg:grid-cols-[auto,2fr,auto] lg:grid-rows-[auto,1fr] lg:flex-row">
                  {/* SUB SIDEBAR */}
                  <SubSidebar />

                  {/* CONTENT */}
                  <div className="lg:col-start-2 lg:col-end-4">
                    <div className="mx-auto max-w-[1400px]">
                      {/* NAVIGATION */}
                      <Navigation />

                      <Outlet />

                      {/* NEW STANDARD */}
                      <div className="mt-20">
                        <NewStandard />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DefaultLayout;