import { Details } from "~/components/shared";

const tabs = [
  {
    heading: "Requirements",
    panel: [
      {
        title: "Have prime",
        subtitle: "Only players with prime can drop weekly",
      },
    ],
  },
  {
    heading: "Extra Options",
    panel: [
      {
        title: "Live Stream",
        subtitle: "Watch your booster's gameplay in real-time",
      },
      {
        title: "Play with Partners (Duo)",
        subtitle: "Your booster will team up with you in duo mode",
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
    subtitle="All the important details about our Level Farming"
    tabs={tabs}
  />
);

export default ListDetail;
