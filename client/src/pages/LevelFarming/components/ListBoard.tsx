import { Board } from "~/components/shared";

const XPEarnDetail = [
  {
    header: "Game mode",
    content: ["Arms Race", "Casual", "Competitive", "Deathmatch", "Wingman"],
  },
  {
    header: "XP multiplier",
    content: [
      "1.0*score",
      "4.0*score",
      "30*rounds won",
      "0.2*score",
      "15*rounds won",
    ],
  },
];

const XPPenaltyDetail = [
  {
    header: "Approximate",
    content: [
      "Less than 4,500 XP",
      "Between 4,500 XP and 7,500 XP",
      "Between 7,500 XP and 11,167 XP",
      "Greater than 11,167 XP",
    ],
  },
  {
    header: "Bonus XP multiplier",
    content: [
      "4.0 * gained XP (1x Earned XP + 3x Weekly XP Bonus)",
      "2.0 * gained XP (1x Earned XP + 1x Weekly XP Bonus)",
      "1.0 * gained XP (1x Earned XP, No Weekly XP Bonus)",
      "0.175 * gained XP (0.175x Earned XP)",
    ],
  },
];

const ListBoard = () => (
  <>
    <Board
      title="Earned XP"
      subtitle="All important details about experience points of each mode"
      boards={XPEarnDetail}
    />
    <Board
      title="XP Penalty"
      subtitle="All important details about experience points"
      boards={XPPenaltyDetail}
    />
  </>
);

export default ListBoard;
