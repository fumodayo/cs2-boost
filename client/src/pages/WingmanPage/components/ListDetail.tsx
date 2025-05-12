import { Details } from "~/components/shared";

const tabs = [
  {
    heading: "Requirements",
    panel: [
      {
        title: "Have prime",
        subtitle: "Only players with prime can drop weekly",
      },
      {
        title: "Complete the first 10 win matches",
        subtitle: "We need your starting rank to conveniently boost",
      },
    ],
  },
  {
    heading: "Extra Options",
    panel: [
      {
        title: "Play with Partners (Duo)",
        subtitle: "Your booster will team up with you in duo mode",
      },
      {
        title: "Live Stream",
        subtitle: "Watch your booster's gameplay in real-time",
      },
    ],
  },
  {
    heading: "FAQ",
    isQuestions: true,
    panel: [],
  },
];

const ListDetail = () => (
  <Details
    title="Info"
    subtitle="All the important details about our Premier Boost"
    tabs={tabs}
  />
);

export default ListDetail;
