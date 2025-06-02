import {
  DataTable,
  Helmet,
  Pagination,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { FaWallet } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useToggleColumns } from "~/hooks/useToggleColumns";
import { walletHeaders } from "~/constants/headers";
import { IPaymentProps } from "~/types";
import { axiosAuth } from "~/axiosAuth";
import { useSearchParams } from "react-router-dom";

const WalletPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [receipts, setReceipts] = useState<IPaymentProps[]>([]);
  const [totalReceipts, setTotalReceipts] = useState<number>(0);

  const { selectedColumns, visibleHeaders, toggleColumn } = useToggleColumns(
    "wallet-headers",
    walletHeaders,
  );

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosAuth.get(
          `/receipt/get-receipts?${searchParams}`,
        );
        const { receipts, total } = data;
        setReceipts(receipts);
        setTotalReceipts(total);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [searchParams]);

  const handleReset = () => {
    const params = new URLSearchParams();
    setSearchParams(params);
    setSearchTerm("");
  };

  return (
    <>
      <Helmet title="My Wallet" />
      <div>
        <Heading
          icon={FaWallet}
          title="My Wallet"
          subtitle="List of all your payments and transactions."
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  {/* SEARCH */}
                  <Search
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  {searchTerm && <ResetButton onReset={handleReset} />}
                </div>

                {/* VIEW LIST */}
                <ViewButton
                  headers={walletHeaders}
                  toggleColumn={toggleColumn}
                  selectedColumns={selectedColumns}
                />
              </div>

              {/* DATA LIST */}
              <DataTable
                headers={visibleHeaders}
                toggleColumn={toggleColumn}
                payments={receipts}
              />

              {/* PAGINATION */}
              <Pagination total={totalReceipts} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default WalletPage;
