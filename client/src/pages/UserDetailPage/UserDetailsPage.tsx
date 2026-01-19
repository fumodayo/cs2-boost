import React from "react";
import { useParams, Link } from "react-router-dom";
import useSWR from "swr";
import { Helmet, Spinner, ErrorDisplay } from "~/components/ui";
import {
  FaShoppingCart,
  FaCreditCard,
  FaCog,
  FaArrowLeft,
} from "react-icons/fa";
import { Button } from "~/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  UserOrdersTable,
  UserProfileCard,
  UserSettingsPanel,
  UserTransactionsTable,
} from "./components";
import { useTranslation } from "react-i18next";
import { userService } from "~/services/user.service";

const UserDetailsPage: React.FC = () => {
  const { t } = useTranslation("user_details_page");
  const { userId } = useParams<{ userId: string }>();

  const {
    data: userData,
    error: userError,
    isLoading: isLoadingUser,
    mutate: mutateUser,
  } = useSWR(userId ? `/users/${userId}` : null, () =>
    userService.getUserById(userId!),
  );

  if (isLoadingUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (userError || !userData) {
    return (
      <ErrorDisplay message="Failed to load user data. The user may not exist." />
    );
  }

  return (
    <>
      <Helmet title={`User: ${userData.username} · Admin Panel`} />
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/users">
            <Button variant="outline" size="icon">
              <FaArrowLeft />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground">
              {t("subtitle", { username: userData.username })}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <UserProfileCard user={userData} />
            </div>
          </aside>
          <main className="lg:col-span-3">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid h-auto w-full grid-cols-3 gap-2 rounded-2xl bg-muted/50 p-1.5 text-muted-foreground">
                <TabsTrigger
                  value="orders"
                  className="rounded-xl py-3 text-base font-medium transition-all hover:bg-background/50 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaShoppingCart size={20} />
                    {t("tabs.orders")}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="rounded-xl py-3 text-base font-medium transition-all hover:bg-background/50 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaCreditCard size={20} />
                    {t("tabs.transactions")}
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-xl py-3 text-base font-medium transition-all hover:bg-background/50 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FaCog size={20} />
                    {t("tabs.settings")}
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="mt-8">
                <UserOrdersTable userId={userId!} />
              </TabsContent>
              <TabsContent value="transactions" className="mt-8">
                <UserTransactionsTable userId={userId!} />
              </TabsContent>
              <TabsContent value="settings" className="mt-8">
                <UserSettingsPanel
                  user={userData}
                  onActionSuccess={mutateUser}
                />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserDetailsPage;