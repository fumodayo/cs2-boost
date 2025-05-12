import parse from "html-react-parser";

const Information = ({ details }: { details?: string }) => {
  return <div className="flex flex-col">{details && parse(details)}</div>;
};

export default Information;
