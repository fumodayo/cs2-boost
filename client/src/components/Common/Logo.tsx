import clsx from "clsx";

const Logo = () => {
  return (
    <a className="relative flex-1" href="/">
      <img
        className={clsx("block h-8 w-[100px]", "dark:hidden")}
        src="/assets/brand/icon-text-dark.png"
        alt="CS2 Boost Logo"
      />
      <img
        className={clsx("hidden h-8 w-[100px]", "dark:block")}
        src="/assets/brand/icon-text.png"
        alt="CS2 Boost Logo"
      />
    </a>
  );
};

export default Logo;
