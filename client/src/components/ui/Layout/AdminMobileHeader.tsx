import cn from "~/libs/utils";
import { Logo } from "~/components/ui/Misc";
import { AdminAvatar } from "~/components/ui/Avatar";

const AdminMobileHeader = () => {
  return (
    <header className="relative xl:hidden">
      <nav
        className={cn(
          "fixed top-0 z-30 w-full border-b border-border px-4",
          "before:absolute before:inset-0 before:bg-card-alt before:p-px before:transition-all before:duration-200",
          "before:bg-card-surface/75 before:backdrop-blur-xl sm:px-6",
          "dark:border-transparent dark:before:bg-[#151824]/50",
        )}
      >
        <div className="mx-auto flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="relative">
            <Logo />
          </div>

          {/* Avatar */}
          <div className="relative flow-root">
            <AdminAvatar />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminMobileHeader;