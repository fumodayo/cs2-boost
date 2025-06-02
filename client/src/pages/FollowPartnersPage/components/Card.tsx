import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { axiosAuth } from "~/axiosAuth";
import { Button } from "~/components/shared";
import { useSocketContext } from "~/hooks/useSocketContext";
import {
  updatedStart,
  updateFailure,
  updateSuccess,
} from "~/redux/user/userSlice";
import { ICurrentUserProps } from "~/types";

const Card = ({ _id, username, profile_picture }: ICurrentUserProps) => {
  const { onlinePartners } = useSocketContext();
  const isOnline = onlinePartners.includes(_id as string);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleUnFollow = async () => {
    if (loading) return;

    dispatch(updatedStart());

    try {
      const { data } = await axiosAuth.post(`/user/unfollow/${_id}`);
      dispatch(updateSuccess(data));
      toast.success("UnFollowed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      dispatch(updateFailure(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/partner/${username}`}
      className="hover:scale-101 block transform transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex w-full items-center justify-between rounded-md border-card-alt bg-card p-2 text-card-foreground transition hover:opacity-85 dark:bg-card-alt">
        {/* Avatar + Name */}
        <div className="flex items-center space-x-3">
          <img
            className="h-10 w-10 rounded-sm border border-gray-600"
            src={profile_picture}
            alt="avatar"
          />
          <div className="flex items-center space-x-1">
            <span className="font-medium">{username}</span>
            <FaCheckCircle className="text-success" />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span
            className={`text-sm ${isOnline ? "text-success" : "secondary"}`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
          <Button
            disabled={loading}
            variant="transparent"
            className="rounded bg-danger px-2 py-1.5 text-center text-xs text-white transition hover:bg-danger-hover"
            onClick={(e) => {
              e.preventDefault();
              handleUnFollow();
            }}
          >
            <IoIosCloseCircle className="mr-1" />
            Unfollow
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default Card;
