import parse from "html-react-parser";

const Information = ({ details }: { details?: string }) => {
  if (!details || details.trim() === "<p><br></p>") {
    return (
      <p className="text-sm text-muted-foreground">
        This partner hasn't added an introduction yet.
      </p>
    );
  }
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {parse(details)}
    </div>
  );
};

export default Information;
