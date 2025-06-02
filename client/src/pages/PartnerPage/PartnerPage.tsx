import { useContext, useEffect, useState } from "react";
import {
  FaCircleCheck,
  FaFacebook,
  FaHeart,
  FaInstagram,
  FaRegHeart,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import Tooltip from "~/components/@radix-ui/Tooltip";
import { Button, Chip, Footer, Header, Helmet } from "~/components/shared";
import cn from "~/libs/utils";
import { Comment, Information, Pagination, Stats } from "./components";
import { v4 as uuidv4 } from "uuid";
import { axiosAuth, axiosInstance } from "~/axiosAuth";
import { ICurrentUserProps, IReviewProps } from "~/types";
import formatDate from "~/utils/formatDate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { AppContext } from "~/components/context/AppContext";
import toast from "react-hot-toast";
import { useSocketContext } from "~/hooks/useSocketContext";
import {
  updatedStart,
  updateFailure,
  updateSuccess,
} from "~/redux/user/userSlice";

const socials = [
  {
    name: "facebook",
    icon: FaFacebook,
    color: "bg-[#1877F2] hover:bg-[#145dbf]",
  },
  {
    name: "instagram",
    icon: FaInstagram,
    color: "bg-[#E4405F] hover:bg-[#c13584]",
  },
  {
    name: "x",
    icon: FaTwitter,
    color: "bg-[#000000] hover:bg-[#1a1a1a]",
  },
  {
    name: "youtube",
    icon: FaYoutube,
    color: "bg-[#FF0000] hover:bg-[#cc0000]",
  },
  {
    name: "tiktok",
    icon: FaTiktok,
    color: "bg-[#000000] hover:bg-[#1a1a1a]",
  },
];

const PartnerPage = () => {
  const { username } = useParams();
  const [partner, setPartner] = useState<ICurrentUserProps>();
  const [reviews, setReviews] = useState<IReviewProps[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;
  const [totalPages, setTotalPages] = useState(1);

  const { loading, currentUser } = useSelector(
    (state: RootState) => state.user,
  );
  const { toggleLoginModal } = useContext(AppContext);
  const dispatch = useDispatch();

  const { onlinePartners } = useSocketContext();
  const isOnline = onlinePartners.includes(partner?._id as string);

  useEffect(() => {
    (async () => {
      const { data } = await axiosInstance.get(`/user/get-partner/${username}`);
      setPartner(data);
    })();
  }, [username]);

  useEffect(() => {
    (async () => {
      const { data } = await axiosInstance.get(
        `/review/get-reviews/${username}?page=${page}$per_page=${perPage}`,
      );
      const { reviews, totalPages } = data;
      setReviews(reviews);
      setTotalPages(totalPages);
    })();
  }, [username, page]);

  const isFollowed = currentUser?.following.some((i) => i._id === partner?._id);
  const [isFollow, setIsFollow] = useState(isFollowed);

  useEffect(() => {
    setIsFollow(isFollowed);
  }, [isFollowed]);

  const handleFollow = async () => {
    if (!currentUser) {
      toggleLoginModal();
      return;
    }
    if (loading) return;

    dispatch(updatedStart());

    try {
      if (isFollow) {
        const { data } = await axiosAuth.post(`/user/unfollow/${partner?._id}`);
        dispatch(updateSuccess(data));
        toast.success("UnFollowed");
      } else {
        const { data } = await axiosAuth.post(`/user/follow/${partner?._id}`);
        dispatch(updateSuccess(data));
        toast.success("Followed");
      }
      setIsFollow((prevState) => !prevState);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred";
      dispatch(updateFailure(message));
    }
  };

  const filteredSocials = socials.filter((social) =>
    (partner?.social_links ?? []).some((link) => link.type === social.name),
  );

  return (
    <>
      <Helmet title="Orders List · CS2Boost" />
      <div>
        {/* HEADER */}
        <Header />
        <main>
          <div
            className={cn(
              "ml-10 min-h-screen space-y-20",
              "sm:space-y-40 lg:mt-20 lg:space-y-52",
            )}
          >
            <div
              className={cn(
                "relative mx-auto flex w-full max-w-7xl space-x-6 px-2 py-6",
                "sm:px-2 lg:px-8",
              )}
            >
              <div className="flex basis-1/4 flex-col items-center space-y-2">
                <img
                  className="w-[250px] border border-border sm:rounded-xl"
                  src={partner?.profile_picture}
                  alt="avatar"
                />
                <p
                  className={cn(
                    "pt-1 text-xl font-bold",
                    isOnline ? "text-success" : "text-danger",
                  )}
                >
                  {isOnline ? "Is ready" : "Not ready"}
                </p>
                {filteredSocials.length > 0 && (
                  <div className="pt-2">
                    <p className="pb-2 font-bold">Liên hệ qua:</p>
                    <div className="flex items-center justify-center space-x-3">
                      {filteredSocials.map(({ name, icon: Icon, color }) => {
                        const socialLink = (partner?.social_links ?? []).find(
                          (link) => link.type === name,
                        );
                        return (
                          <div key={uuidv4()} className="w-auto">
                            {socialLink && (
                              <Link to={socialLink.link} target="_blank">
                                <Tooltip content={name}>
                                  <Button
                                    variant="transparent"
                                    className={cn(
                                      "h-9 w-9 items-center justify-center rounded-md transition-colors",
                                      color,
                                    )}
                                  >
                                    <span className="sr-only">{name}</span>
                                    <Icon />
                                  </Button>
                                </Tooltip>
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <span className="pt-2">
                  Ngày tham gia: {formatDate(partner?.createdAt)}
                </span>
              </div>
              <div className="basis-2/4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <h1 className="text-3xl font-bold">{partner?.username}</h1>
                    <Tooltip content="Đã được xác minh">
                      <div>
                        <FaCircleCheck className="ml-1 mt-0.5 text-success" />
                      </div>
                    </Tooltip>
                  </div>
                  <Button variant="none" disabled={loading}>
                    {isFollow ? (
                      <Chip
                        onClick={handleFollow}
                        className="cursor-pointer bg-danger pb-2 text-sm text-foreground ring-0"
                      >
                        <FaHeart className="mr-1.5" />
                        Hủy theo dõi
                      </Chip>
                    ) : (
                      <Chip
                        onClick={handleFollow}
                        className="cursor-pointer bg-danger pb-2 text-sm text-foreground ring-0"
                      >
                        <FaRegHeart className="mr-1.5" />
                        Theo dõi
                      </Chip>
                    )}
                  </Button>
                </div>
                <div className="flex space-x-4">
                  <Stats
                    title="Số người theo dõi"
                    subtitle={partner?.followers_count + " người"}
                  />
                  <Stats
                    title="Đã được thuê"
                    subtitle={partner?.total_working_time + " giờ"}
                  />
                  <Stats
                    title="Tỷ lệ hoàn thành"
                    subtitle={partner?.total_rating + " %"}
                  />
                </div>
                <hr className="mb-4 mt-4 w-full border-foreground opacity-10" />
                <div className="flex flex-col">
                  <p className="text-xl font-bold">Thông tin</p>
                  <Information details={partner?.details} />
                </div>
                <hr className="mb-4 mt-4 w-full border-foreground opacity-10" />
                <h3 className="pb-4 text-xl font-bold">Đánh giá</h3>
                <div className="flex flex-col items-center">
                  {reviews.map(({ ...props }) => (
                    <div key={uuidv4()}>
                      <Comment {...props} />
                      <hr className="mb-4 mt-4 w-full border-foreground opacity-10" />
                    </div>
                  ))}

                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    setPage={setPage}
                  />
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

export default PartnerPage;
