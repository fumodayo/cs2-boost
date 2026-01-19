import parse from "html-react-parser";

const Information = ({
  details,
  noIntroductionText,
}: {
  details?: string;
  noIntroductionText: string;
}) => {
  if (!details || details.trim() === "<p><br></p>") {
    return (
      <p className="text-sm text-muted-foreground">{noIntroductionText}</p>
    );
  }
  return (
    <div className="prose prose-sm dark:prose-invert line-clamp-6 max-w-none overflow-hidden">
      {parse(details)}
    </div>
  );
};

export default Information;