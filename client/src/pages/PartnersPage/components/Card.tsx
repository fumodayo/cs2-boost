import { FaCircleCheck, FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Chip, Widget } from "~/components/shared";
import { useSocketContext } from "~/hooks/useSocketContext";
import { IconDotBig } from "~/icons";
import { ICurrentUserProps } from "~/types";

const Card = (partner: ICurrentUserProps) => {
  const { onlinePartners } = useSocketContext();
  const isOnline = onlinePartners.includes(partner._id as string);

  return (
    <Link to={`/partner/${partner.username}`}>
      <div className="hover:scale-102 min-w-[220px] max-w-[220px] transform p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <Widget>
          <div className="">
            <img
              className="h-full w-full border border-border object-cover sm:rounded-t-xl"
              src={partner?.profile_picture}
              alt="avatar"
            />
          </div>
          <Widget.Footer>
            <div className="flex w-full flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center truncate">
                  <h1 className="truncate text-sm">{partner.username}</h1>
                  <FaCircleCheck className="ml-1 mt-0.5 text-success" />
                </div>

                {isOnline ? (
                  <Chip>
                    <IconDotBig />
                    <span className="flex-1 shrink-0 truncate">Online</span>
                  </Chip>
                ) : (
                  <Chip className="bg-danger-light text-danger-light-foreground ring-danger">
                    <IconDotBig />
                    <span className="flex-1 shrink-0 truncate">Offline</span>
                  </Chip>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <p>Rate: {partner.total_completion_rate}%</p>
                <span className="flex items-center">
                  <FaStar className="ml-1 text-danger" />
                  {partner.total_rating} ({partner.total_reviews})
                </span>
              </div>
            </div>
          </Widget.Footer>
        </Widget>
      </div>
    </Link>
  );
};

export default Card;
