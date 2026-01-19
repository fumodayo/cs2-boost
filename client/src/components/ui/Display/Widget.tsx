const Widget = ({ children }: { children?: React.ReactNode }) => (
  <div className="-mx-4 border border-border bg-card text-card-foreground shadow-sm dark:bg-card-alt sm:mx-0 sm:rounded-xl">
    {children}
  </div>
);

const Header = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`flex flex-row items-center justify-between space-y-1.5 border-b border-border bg-muted/20 px-4 py-3 sm:rounded-t-xl sm:px-6 ${className || ""}`}
  >
    {children}
  </div>
);

const BigHeader = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex flex-col space-y-1.5 border-b border-border bg-muted/20 px-4 py-6 sm:rounded-t-xl sm:px-6">
    {children}
  </div>
);

const Content = ({ children }: { children?: React.ReactNode }) => (
  <div className="px-0 pt-0 sm:px-6">{children}</div>
);

const Footer = ({ children }: { children?: React.ReactNode }) => (
  <div className="flex items-center border-t border-border bg-muted/20 px-4 py-3 sm:rounded-b-xl sm:px-6">
    {children}
  </div>
);

const Item = ({ children }: { children?: React.ReactNode }) => (
  <div className="border-t border-border/50 px-4 py-6 sm:col-span-1 sm:px-0">
    {children}
  </div>
);

Widget.Header = Header;
Widget.BigHeader = BigHeader;
Widget.Content = Content;
Widget.Footer = Footer;
Widget.Item = Item;

export default Widget;