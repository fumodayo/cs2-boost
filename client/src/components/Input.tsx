import clsx from "clsx";

interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ type, placeholder }) => {
  return (
    <div className="w-full">
      <input
        placeholder="Email Address"
        autoFocus
        className={clsx(
          "input-error block w-full rounded-md border-0 bg-field px-4 py-2.5 text-field-foreground shadow-sm ring-1  ring-field-ring placeholder:text-muted-foreground hover:ring-field-ring-hover focus:ring-field-ring-hover disabled:pointer-events-none disabled:opacity-50 sm:text-sm",
        )}
        type="text"
      />
      <p className="mt-1 text-sm text-danger-light-foreground">
        The email field is required.
      </p>
    </div>
  );
};

export default Input;
