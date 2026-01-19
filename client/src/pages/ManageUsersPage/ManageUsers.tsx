import { useState } from "react";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { FaPlus, FaUsers } from "react-icons/fa6";
import {
  Heading,
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/ui";
import { AddUserModal } from "./components";
import { Button } from "~/components/ui/Button";
import { usersHeaders } from "~/constants/headers";
import { IUser, IPaginatedResponse } from "~/types";
import getErrorMessage from "~/utils/errorHandler";
import { adminService } from "~/services/admin.service";
import { DataTableLayout, UsersTable } from "~/components/ui/DataTable";
import { filterBanStatus, filterUserRole } from "~/constants/order";
import { useDataTable } from "~/hooks/useDataTable";

const ManageUserPage = () => {
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const { trigger: triggerBan, isMutating: isBanning } = useSWRMutation(
    "/admin/users/ban",
    (_, { arg }: { arg: { userId: string; reason: string } }) =>
      adminService.banUser(arg.userId, { reason: arg.reason }),
  );

  const { trigger: triggerUnban, isMutating: isUnbanning } = useSWRMutation(
    "/admin/users/unban",
    (_, { arg: userId }: { arg: string }) => adminService.unbanUser(userId),
  );

  const handleBanUser = async (userId: string, reason: string) => {
    try {
      const updatedUser = await triggerBan({ userId, reason });
      toast.success(`User ${updatedUser.data.username} has been banned.`);
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const updatedUser = await triggerUnban(userId);
      toast.success(`User ${updatedUser.data.username} has been unbanned.`);
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const {
    data: usersData,
    error,
    isLoading,
    filters,
    setFilter,
    handleReset,
    isAnyFilterActive,
    selectedColumns,
    visibleHeaders,
    toggleColumn,
    mutate,
  } = useDataTable<IPaginatedResponse<IUser>>({
    swrKey: "/admin/users",
    fetcher: adminService.getUsers,
    initialFilters: {
      search: "",
      role: [],
      is_banned: [],
    },
    columnConfig: {
      key: "manage-users-headers",
      headers: usersHeaders,
    },
    socketEvent: "statusOrderChange",
  });

  const usersFromAPI = usersData?.data || [];
  const paginationFromAPI = usersData?.pagination;

  return (
    <>
      <Helmet title="manage_users_page" />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserAdded={() => {
          toast.success("New user created successfully!");
          mutate();
        }}
      />

      <div>
        <Heading
          icon={FaUsers}
          title="manage_users_page_title"
          subtitle="manage_users_page_subtitle"
        />
        <main>
          <div className="mt-8">
            <div className="space-y-4">
              <DataTableLayout
                filterBar={
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                      <Search
                        value={filters.search as string}
                        onChangeValue={(val) => setFilter("search", val)}
                      />
                      <PlusButton
                        name="role"
                        lists={filterUserRole}
                        selectValues={filters["role"] as string[]}
                        setSelectValues={(val) =>
                          setFilter("role", val as string[])
                        }
                      />
                      <PlusButton
                        name="status"
                        lists={filterBanStatus}
                        selectValues={filters["is_banned"] as string[]}
                        setSelectValues={(val) =>
                          setFilter("is_banned", val as string[])
                        }
                      />
                      {isAnyFilterActive && (
                        <ResetButton onReset={handleReset} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setIsAddUserModalOpen(true)}
                      >
                        <FaPlus className="mr-2" /> Add User
                      </Button>
                      <ViewButton
                        headers={usersHeaders}
                        toggleColumn={toggleColumn}
                        selectedColumns={selectedColumns}
                      />
                    </div>
                  </div>
                }
                isLoading={isLoading}
                error={error}
                data={usersFromAPI}
                pagination={paginationFromAPI}
              >
                {(data) => (
                  <UsersTable
                    headers={visibleHeaders}
                    toggleColumn={toggleColumn}
                    users={data}
                    onBanUser={handleBanUser}
                    onUnbanUser={handleUnbanUser}
                    isProcessingAction={isBanning || isUnbanning}
                  />
                )}
              </DataTableLayout>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ManageUserPage;