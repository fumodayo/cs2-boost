import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";
import toast from "react-hot-toast";
import clsx from "clsx";
import { formatDistanceDate } from "~/utils";
import { notificationService } from "~/services/notification.service";
import { INotification } from "~/types";
import { NOTIFY_TYPE } from "~/types/constants";
import { HiChevronRight } from "react-icons/hi2";
import getErrorMessage from "~/utils/errorHandler";
interface NewNotifyProps extends INotification {
  mutate: KeyedMutator<INotification[]>;
  version?: string;
}
const NewNotify = ({
  _id,
  title,
  image,
  content,
  boost_id,
  report_id,
  createdAt,
  type,
  isRead,
  mutate,
  version,
}: NewNotifyProps) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const getLinkTo = () => {
    if (type === NOTIFY_TYPE.NEW_ORDER) {
      return "/pending-boosts";
    }
    if (type === NOTIFY_TYPE.NEW_PARTNER_REQUEST) {
      return "/admin/partner-requests";
    }
    if (type === NOTIFY_TYPE.NEW_REPORT) {
      return "/admin/manage-reports";
    }
    if (
      type === NOTIFY_TYPE.REPORT_ACCEPTED ||
      type === NOTIFY_TYPE.REPORT_REJECTED
    ) {
      return report_id ? `/supports?report=${report_id}` : "/supports";
    }
    if (
      type === NOTIFY_TYPE.REPORT_MESSAGE ||
      type === NOTIFY_TYPE.NEW_REPORT_MESSAGE
    ) {
      return report_id
        ? `/admin/manage-reports?report=${report_id}`
        : "/admin/manage-reports";
    }
    if (boost_id) {
      return `/orders/boosts/${boost_id}`;
    }
    return null;
  };
  const linkTo = getLinkTo();
  const handleClick = async () => {
    try {
      if (!isRead) {
        await notificationService.readNotification(_id);
        mutate();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      toast.error(errorMessage);
    } finally {
      if (linkTo) {
        navigate(linkTo);
      }
    }
  };
  return (
    <div
      onClick={handleClick}
      className={clsx(
        "group relative cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all duration-200",
        isRead
          ? "border-border bg-card/50 hover:bg-card"
          : "border-primary/30 bg-card hover:shadow-md",
      )}
    >
      {/* Phần Hình ảnh Banner (Giống hình 2) */}
      {image && (
        <div className="relative h-28 w-full overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
          <img
            src={image}
            alt={title || "Notification"}
            className="h-full w-full transform object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      {/* Phần Nội dung */}
      <div className="relative p-4">
        {/* Tiêu đề + Chấm xanh + Thời gian */}
        <div className="mb-1 flex items-start justify-between">
          <div className="flex items-center gap-2">
            {!isRead && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            )}
            <h3
              className={clsx(
                "text-base font-bold",
                isRead ? "text-muted-foreground" : "text-foreground",
              )}
            >
              {title || "Notification"}
            </h3>
          </div>
          <span className="ml-2 whitespace-nowrap text-xs font-medium text-muted-foreground">
            {createdAt && formatDistanceDate(createdAt, i18n.language)}
          </span>
        </div>
        {/* Nội dung mô tả */}
        <p
          className={clsx(
            "mb-3 line-clamp-2 text-sm leading-relaxed",
            isRead ? "text-muted-foreground" : "text-foreground/80",
          )}
        >
          {content}
        </p>
        {/* Badges và Icon mũi tên */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {/* Badge Version (nếu có) */}
            {version && (
              <span className="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {version}
              </span>
            )}
            {/* Badge New (nếu chưa đọc) */}
            {!isRead && (
              <span className="inline-flex items-center rounded bg-warning/20 px-2 py-0.5 text-[10px] font-bold text-warning-foreground">
                New
              </span>
            )}
          </div>
          <HiChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
};
export default NewNotify;