import { useState } from "react";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import {
  FaUserCheck,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import {
  Heading,
  Helmet,
  PlusButton,
  ResetButton,
  Search,
  ViewButton,
} from "~/components/ui";
import { Select } from "~/components/ui/Form";
import { Button } from "~/components/ui/Button";
import { IPartnerRequest, IPaginatedResponse, IDuplicateInfo } from "~/types";
import getErrorMessage from "~/utils/errorHandler";
import { adminService } from "~/services/admin.service";
import {
  DataTableLayout,
  PartnerRequestsTable,
} from "~/components/ui/DataTable";
import { useDataTable } from "~/hooks/useDataTable";
import {
  Dialog,
  AlertDialogContent,
  DialogClose,
} from "~/components/@radix-ui/Dialog";
import { IDataListHeaders } from "~/constants/headers";
import { filterPartnerRequestStatus } from "~/constants/order";

const partnerRequestHeaders: IDataListHeaders[] = [
  { translationKey: "user", value: "user" },
  { translationKey: "full_name", value: "full_name" },
  { translationKey: "cccd_number", value: "cccd_number" },
  { translationKey: "status", value: "status" },
  { translationKey: "created_at", value: "createdAt", isSort: true },
  { translationKey: "actions", value: "actions" },
];

const ManagePartnerRequestsPage = () => {
  const [selectedRequest, setSelectedRequest] =
    useState<IPartnerRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { trigger: triggerApprove, isMutating: isApproving } = useSWRMutation(
    "/admin/partner-requests/approve",
    (_, { arg: id }: { arg: string }) => adminService.approvePartnerRequest(id),
  );

  const { trigger: triggerReject, isMutating: isRejecting } = useSWRMutation(
    "/admin/partner-requests/reject",
    (_, { arg }: { arg: { id: string; reason: string } }) =>
      adminService.rejectPartnerRequest(arg.id, arg.reason),
  );

  const handleApprove = async (request: IPartnerRequest) => {
    try {
      await triggerApprove(request._id);
      toast.success(`Partner request for ${request.full_name} approved!`);
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    try {
      await triggerReject({ id: selectedRequest._id, reason: rejectReason });
      toast.success(
        `Partner request for ${selectedRequest.full_name} rejected.`,
      );
      setIsRejectOpen(false);
      setRejectReason("");
      setSelectedRequest(null);
      mutate();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const {
    data: requestsData,
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
  } = useDataTable<IPaginatedResponse<IPartnerRequest>>({
    swrKey: "/admin/partner-requests",
    fetcher: adminService.getPartnerRequests,
    initialFilters: {
      search: "",
      status: [],
    },
    columnConfig: {
      key: "manage-partner-requests-headers",
      headers: partnerRequestHeaders,
    },
  });

  const requestsFromAPI = requestsData?.data || [];
  const paginationFromAPI = requestsData?.pagination;

  return (
    <>
      <Helmet title="Partner Requests" />

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <AlertDialogContent
          title="Partner Request Details"
          subtitle="Review the partner request information"
        >
          {/* Close Button */}
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <HiXMark className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative block h-16 w-16 shrink-0 rounded-full">
                  <img
                    className="h-full w-full rounded-full object-cover"
                    src={selectedRequest.user?.profile_picture}
                    alt={selectedRequest.user?.username}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {selectedRequest.user?.username}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.user?.email_address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
                {/* Full Name Field */}
                {(() => {
                  const duplicate = selectedRequest.duplicates?.find(
                    (d: IDuplicateInfo) => d.field === "full_name",
                  );
                  return (
                    <div
                      className={`rounded-md p-2 ${
                        duplicate
                          ? duplicate.matchingPartner.is_banned
                            ? "border border-red-500/50 bg-red-500/10"
                            : "border border-yellow-500/50 bg-yellow-500/10"
                          : ""
                      }`}
                    >
                      <label className="text-xs text-muted-foreground">
                        Full Name
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {selectedRequest.full_name}
                        </p>
                        {duplicate && (
                          <FaExclamationTriangle
                            className={
                              duplicate.matchingPartner.is_banned
                                ? "text-red-500"
                                : "text-yellow-500"
                            }
                          />
                        )}
                      </div>
                      {duplicate && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <img
                            src={duplicate.matchingPartner.profile_picture}
                            alt={duplicate.matchingPartner.username}
                            className="h-5 w-5 rounded-full"
                          />
                          <span className="text-muted-foreground">
                            Trùng với:{" "}
                            <strong>
                              {duplicate.matchingPartner.username}
                            </strong>
                            {duplicate.matchingPartner.is_banned && (
                              <span className="ml-1 text-red-500">
                                (Banned)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* CCCD Number Field */}
                {(() => {
                  const duplicate = selectedRequest.duplicates?.find(
                    (d: IDuplicateInfo) => d.field === "cccd_number",
                  );
                  return (
                    <div
                      className={`rounded-md p-2 ${
                        duplicate
                          ? duplicate.matchingPartner.is_banned
                            ? "border border-red-500/50 bg-red-500/10"
                            : "border border-yellow-500/50 bg-yellow-500/10"
                          : ""
                      }`}
                    >
                      <label className="text-xs text-muted-foreground">
                        CCCD Number
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {selectedRequest.cccd_number}
                        </p>
                        {duplicate && (
                          <FaExclamationTriangle
                            className={
                              duplicate.matchingPartner.is_banned
                                ? "text-red-500"
                                : "text-yellow-500"
                            }
                          />
                        )}
                      </div>
                      {duplicate && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <img
                            src={duplicate.matchingPartner.profile_picture}
                            alt={duplicate.matchingPartner.username}
                            className="h-5 w-5 rounded-full"
                          />
                          <span className="text-muted-foreground">
                            Trùng với:{" "}
                            <strong>
                              {duplicate.matchingPartner.username}
                            </strong>
                            {duplicate.matchingPartner.is_banned && (
                              <span className="ml-1 text-red-500">
                                (Banned)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Phone Number Field */}
                {(() => {
                  const duplicate = selectedRequest.duplicates?.find(
                    (d: IDuplicateInfo) => d.field === "phone_number",
                  );
                  return (
                    <div
                      className={`rounded-md p-2 ${
                        duplicate
                          ? duplicate.matchingPartner.is_banned
                            ? "border border-red-500/50 bg-red-500/10"
                            : "border border-yellow-500/50 bg-yellow-500/10"
                          : ""
                      }`}
                    >
                      <label className="text-xs text-muted-foreground">
                        Phone
                      </label>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {selectedRequest.phone_number}
                        </p>
                        {duplicate && (
                          <FaExclamationTriangle
                            className={
                              duplicate.matchingPartner.is_banned
                                ? "text-red-500"
                                : "text-yellow-500"
                            }
                          />
                        )}
                      </div>
                      {duplicate && (
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <img
                            src={duplicate.matchingPartner.profile_picture}
                            alt={duplicate.matchingPartner.username}
                            className="h-5 w-5 rounded-full"
                          />
                          <span className="text-muted-foreground">
                            Trùng với:{" "}
                            <strong>
                              {duplicate.matchingPartner.username}
                            </strong>
                            {duplicate.matchingPartner.is_banned && (
                              <span className="ml-1 text-red-500">
                                (Banned)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Gender Field */}
                <div className="p-2">
                  <label className="text-xs text-muted-foreground">
                    Gender
                  </label>
                  <p className="font-medium">{selectedRequest.gender}</p>
                </div>

                {/* Address Field */}
                <div className="col-span-2 p-2">
                  <label className="text-xs text-muted-foreground">
                    Address
                  </label>
                  <p className="font-medium">{selectedRequest.address}</p>
                </div>
              </div>

              {selectedRequest.status === "pending" && (
                <div className="flex justify-end gap-2">
                  <Button
                    className="px-3 py-1.5"
                    variant="danger"
                    onClick={() => {
                      setIsDetailOpen(false);
                      setIsRejectOpen(true);
                    }}
                  >
                    <FaTimes className="mr-2" /> Reject
                  </Button>
                  <Button
                    className="px-3 py-1.5"
                    variant="primary"
                    onClick={() => {
                      handleApprove(selectedRequest);
                      setIsDetailOpen(false);
                    }}
                    disabled={isApproving}
                  >
                    <FaCheck className="mr-2" /> Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </AlertDialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <AlertDialogContent
          title="Reject Partner Request"
          subtitle="Please select a reason for rejection"
        >
          <div className="space-y-4">
            <Select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            >
              <option value="">-- Select a reason --</option>
              <option value="duplicate_name">
                Tên đầy đủ trùng với Partner khác / Duplicate full name
              </option>
              <option value="duplicate_cccd">
                Số CCCD trùng với Partner khác / Duplicate CCCD number
              </option>
              <option value="cccd_expired">
                Ngày cấp CCCD đã hết hạn / CCCD issue date expired
              </option>
              <option value="invalid_info">
                Thông tin không hợp lệ / Invalid information
              </option>
              <option value="other">Lý do khác / Other reason</option>
            </Select>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button className="px-3 py-1.5" variant="light">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="px-3 py-1.5"
                variant="danger"
                onClick={handleReject}
                disabled={isRejecting || !rejectReason}
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </Dialog>

      <div>
        <Heading
          icon={FaUserCheck}
          title="Partner Requests"
          subtitle="Review and manage partner registration requests"
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
                        name="status"
                        lists={filterPartnerRequestStatus}
                        selectValues={filters["status"] as string[]}
                        setSelectValues={(val) =>
                          setFilter("status", val as string[])
                        }
                      />
                      {isAnyFilterActive && (
                        <ResetButton onReset={handleReset} />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ViewButton
                        headers={partnerRequestHeaders}
                        toggleColumn={toggleColumn}
                        selectedColumns={selectedColumns}
                      />
                    </div>
                  </div>
                }
                isLoading={isLoading}
                error={error}
                data={requestsFromAPI}
                pagination={paginationFromAPI}
              >
                {(data) => (
                  <PartnerRequestsTable
                    headers={visibleHeaders}
                    toggleColumn={toggleColumn}
                    requests={data}
                    onViewDetails={(request) => {
                      setSelectedRequest(request);
                      setIsDetailOpen(true);
                    }}
                    onApprove={handleApprove}
                    onReject={(request) => {
                      setSelectedRequest(request);
                      setIsRejectOpen(true);
                    }}
                    isProcessingAction={isApproving || isRejecting}
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

export default ManagePartnerRequestsPage;