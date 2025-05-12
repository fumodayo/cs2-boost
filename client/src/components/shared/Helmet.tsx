import { Helmet as HelmetComp, HelmetData } from "react-helmet-async";

interface IHelmetProps {
  title?: string;
  description?: string;
}

const helmetData = new HelmetData({});

const Helmet = ({
  title = "",
  description = "Counter Strike 2 Boosting",
}: IHelmetProps = {}) => {
  return (
    <HelmetComp
      helmetData={helmetData}
      title={title ? `${title}` : undefined}
      defaultTitle="Counter Strike 2 Boosting"
    >
      <meta name="description" content={description} />
    </HelmetComp>
  );
};

export default Helmet;
