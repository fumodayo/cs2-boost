import { Link } from "react-router-dom";
import PATH from "~/constants/path";
import cn from "~/libs/utils";

const Logo = () => {
  return (
    <Link className="relative" to={PATH.DEFAULT.HOME}>
      <img
        className={cn("block h-8 w-[100px]", "dark:hidden")}
        src="/assets/brand/icon-text.png"
        alt="logo"
      />
      <img
        className={cn("hidden h-8 w-[100px]", "dark:block")}
        src="/assets/brand/icon-text-dark.png"
        alt="logo"
      />
    </Link>
  );
};

export default Logo;
