import UserPage from "../components/Layouts/UserPage";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import clsx from "clsx";
import Widget from "../components/Widget";
import { RiLinksFill } from "react-icons/ri";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SocialMediaProps, socailMedia } from "../constants";

const headers = ["username", "user ID", "email address", "address"];

const SocailWidget: React.FC<SocialMediaProps> = ({
  icon: Icon,
  title,
  subtitle,
  color,
}) => {
  return (
    <div className="flex w-full items-center justify-between border-t border-border/50 px-4 py-6 sm:col-span-1 sm:px-0">
      <div className="flex items-center">
        <div
          className="flex w-12 items-center justify-center rounded-md px-2.5 py-2.5"
          style={{ backgroundColor: color }}
        >
          {Icon && <Icon className="text-[18px] text-white" />}
        </div>
        <div className="ml-2.5 truncate">
          <div className="truncate text-sm font-medium text-foreground">
            {title}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            Connect your {title} account
          </div>
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <a className="relative flex items-center justify-center gap-x-2 overflow-hidden whitespace-nowrap rounded-md bg-secondary px-4 py-2 !text-xs font-medium text-secondary-foreground shadow-sm outline-none ring-1 ring-secondary-ring transition-colors hover:bg-secondary-hover focus:outline focus:outline-offset-2 focus:outline-secondary focus-visible:outline active:translate-y-px disabled:pointer-events-none disabled:opacity-50">
          {/* <RiLinksFill /> */}
          <FaArrowUpRightFromSquare />
          View
        </a>
      </div>
    </div>
  );
};

const Profile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <UserPage>
      <div className="container">
        {/* HEADER */}
        <div className="w-full pb-6">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className="min-w-fit flex-1 flex-grow md:min-w-0">
              <div className="flex flex-wrap items-center gap-y-4">
                <div className="mr-5 flex-shrink-0">
                  <div className="relative">
                    <div className="relative block h-12 w-12 shrink-0 rounded-full text-xl sm:h-16 sm:w-16">
                      <img
                        src="https://cdn.gameboost.com/users/19918/avatar/AAcHTtdFRpMwux-WHt9RoMHs81i8OXPo9eQNI82d1caCUqQLRjU=s96-c.jpeg"
                        className="h-full w-full rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-400 ring-2 ring-card" />
                    </div>
                  </div>
                </div>
                <div className="pt-1.5 sm:truncate">
                  <h1 className="font-display flex flex-wrap items-center text-3xl font-semibold text-foreground sm:truncate sm:tracking-tight">
                    {currentUser?.username}
                  </h1>
                  <p className="text-sm font-medium text-muted-foreground sm:truncate">
                    <div className="inline-flex flex-wrap items-center gap-1">
                      <div className="lowercase">@{currentUser?.username}</div>
                      <span> ⸱ </span>
                      <div>9 boosts</div>
                      <span> ⸱ </span>
                      <div>0 accounts</div>
                    </div>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-5 lg:mx-0 lg:grid-cols-3">
          <div
            className={clsx(
              "space-y-4",
              "lg:col-span-2 lg:row-span-2 lg:row-end-2 lg:space-y-6",
            )}
          >
            <Widget
              titleHeader="User Information"
              headers={headers}
              boostItem={currentUser}
            />
          </div>

          <div className="-mx-4 max-w-2xl border border-border bg-card text-card-foreground shadow-sm sm:mx-0 sm:rounded-xl">
            <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/50 px-4 py-6 sm:rounded-t-xl sm:px-6">
              <h3 className="font-display font-semibold leading-none text-card-surface-foreground">
                Social Media List
              </h3>
            </div>
            <div className="px-0 pt-0 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-1">
                {socailMedia.map(({ icon, title, subtitle, color }) => (
                  <SocailWidget
                    key={subtitle}
                    icon={icon}
                    title={title}
                    subtitle={subtitle}
                    color={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserPage>
  );
};

export default Profile;
