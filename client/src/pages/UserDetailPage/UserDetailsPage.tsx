import React from "react";
import { useParams, Link } from "react-router-dom";
import useSWR from "swr";
import { Helmet, Spinner, ErrorDisplay } from "~/components/shared";
import {
  FaShoppingCart,
  FaCreditCard,
  FaCog,
  FaArrowLeft,
} from "react-icons/fa";
import { Button } from "~/components/shared/Button";
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
  const { t } = useTranslation();
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
            <h1 className="text-2xl font-bold text-foreground">
              {t("UserDetailsPage.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("UserDetailsPage.subtitle", { username: userData.username })}
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="orders">
                  <div className="flex items-center justify-center">
                    <FaShoppingCart size={20} className="mr-2" />
                    {t("UserDetailsPage.tabs.orders")}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="transactions">
                  <div className="flex items-center justify-center">
                    <FaCreditCard size={20} className="mr-2" />
                    {t("UserDetailsPage.tabs.transactions")}
                  </div>
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <div className="flex items-center justify-center">
                    <FaCog size={20} className="mr-2" />
                    {t("UserDetailsPage.tabs.settings")}
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="orders" className="mt-6">
                <UserOrdersTable userId={userId!} />
              </TabsContent>
              <TabsContent value="transactions" className="mt-6">
                <UserTransactionsTable userId={userId!} />
              </TabsContent>
              <TabsContent value="settings" className="mt-6">
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
