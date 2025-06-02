import {
  Button,
  Footer,
  Header,
  Helmet,
  RangeFilter,
  ResetButton,
  Search,
} from "~/components/shared";
import cn from "~/libs/utils";
import { Card } from "./components";
import { useEffect, useState } from "react";
import { ICurrentUserProps } from "~/types";
import { axiosInstance } from "~/axiosAuth";
import { useSearchParams } from "react-router-dom";
import { useSocketContext } from "~/hooks/useSocketContext";
import { RootState } from "~/redux/store";
import { useSelector } from "react-redux";

const PartnersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partners, setPartners] = useState<ICurrentUserProps[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { onlinePartners } = useSocketContext();
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.post(
          `/user/get-partners?${searchParams}`,
          {
            user_id: currentUser?._id,
          },
        );
        setPartners(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [searchParams]);

  console.log(isLoading);

  const handleReset = () => {
    const params = new URLSearchParams();
    params.delete("rate-min");
    params.delete("rate-max");
    params.delete("star-min");
    params.delete("star-max");
    setSearchParams(params);
    setSearchTerm("");
  };

  const filteredPartners = partners.filter(
    (partner) => !filterOnline || onlinePartners.includes(partner._id ?? ""),
  );

  return (
    <>
      <Helmet title="Partners List · CS2Boost" />
      <div>
        {/* HEADER */}
        <Header />
        <main>
          <div
            className={cn(
              "ml-10 space-y-20",
              "sm:space-y-40 lg:mt-20 lg:space-y-52",
            )}
          >
            <div
              className={cn(
                "relative mx-auto max-w-7xl px-2 py-6",
                "sm:px-2 lg:px-8",
              )}
            >
              <div className="pb-4">
                <h1 className="text-3xl font-bold">Danh sách người hỗ trợ</h1>
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap space-x-2">
                  {/* SEARCH */}
                  <Search
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />

                  <Button
                    variant={filterOnline ? "primary" : "transparent"}
                    className={cn(
                      !filterOnline && "border border-dashed border-input",
                      "h-8 rounded-md px-3 text-xs font-medium shadow-sm",
                    )}
                    onClick={() => setFilterOnline((prevState) => !prevState)}
                  >
                    Online
                  </Button>

                  {/* FILTERS */}
                  <RangeFilter
                    min={0}
                    max={5}
                    step={1}
                    defaultValue={[0, 5]}
                    label="Filter Stars"
                    type="star"
                  />

                  <RangeFilter
                    min={0}
                    max={100}
                    step={10}
                    defaultValue={[0, 100]}
                    label="Filter Rating"
                    type="rate"
                  />

                  {(searchTerm.length > 0 || searchParams.size > 0) && (
                    <ResetButton onReset={handleReset} />
                  )}
                </div>

                <div className="flex flex-wrap">
                  {filteredPartners.length > 0 ? (
                    filteredPartners.map((partner, idx) => (
                      <Card key={idx} {...partner} />
                    ))
                  ) : (
                    <div className="flex h-96 w-full items-center justify-center px-2.5 py-2.5">
                      No results
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
};

export default PartnersPage;
