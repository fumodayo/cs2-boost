const RowTable = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td
    className={`p-4 align-middle text-sm ${className}`}
  >
    {children}
  </td>
);

export default RowTable;
