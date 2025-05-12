import Collapsible from "../@radix-ui/Collapsible";
import { v4 as uuidv4 } from "uuid";

interface ICardProps {
  title: string;
  subtitle: string;
}

const cards: ICardProps[] = [
  {
    title: "What is CS2Boost?",
    subtitle:
      "GameBoost is your all-in-one gaming solution for affordable Boosting, expert Coaching, and top-quality gaming accounts. We support popular games such as League of Legends, Valorant, Overwatch 2, LoL_Wild Rift, Teamfight Tactics, CS2, and World of Warcraft.",
  },
  {
    title: "What types of payment methods does CS2Boost accept?",
    subtitle:
      "CS2Boost accepts all major debit and credit cards, PayPal, PaySafeCard, Apple Pay, Google Pay, Direct Bank Transfer, and Skrill, providing you with a variety of payment options to choose from.",
  },
  {
    title: "Why Should I Choose CS2Boost?",
    subtitle:
      "CS2Boost is the highest rated platform on TrustPilot, with a 5.0-star rating and up to 40% lower prices than the competition. Combined with 24/7 live support, this makes us the most affordable and trustworthy gaming services platform on the market.",
  },
  {
    title: "How do I leave feedback or review for the services?",
    subtitle:
      "We highly value customer feedback so if you want to take a moment to leave us a review you can do it on_Trustpilot and Discord. We really appreciate it.",
  },
  {
    title: "Does CS2Boost offer discounts or promotions for its services?",
    subtitle:
      "At CS2Boost, we offer discounts, promotions, and events with the chance to win amazing prizes. Feel free to contact our LiveChat for a discount code if you don't have one and to follow our Discord for new events!",
  },
  {
    title: "I have more questions, where can I get more info?",
    subtitle: "We are here 24/7. Feel free to contact us on our Live Chat!",
  },
];

const Questions = () => {
  return (
    <div>
      {cards.map((props) => (
        <Collapsible key={uuidv4()} {...props} />
      ))}
    </div>
  );
};

export default Questions;
