import { Helmet } from "~/components/shared";
import { Heading } from "../GameModePage/components";
import { BiSupport } from "react-icons/bi";
import { IConversationProps } from "~/types";
import { useState } from "react";
import { Conversation } from "../BoostPage/components";

const conversations: IConversationProps[] = [
  {
    _id: "67eb973459439751b8d653a8",
    participants: ["67de63610a5186fe23edfdd7", "67eb96f859439751b8d6536f"],
    messages: [
      {
        sender: "67de63610a5186fe23edfdd7",
        receiver: "user2",
        message: "Hey, are you coming to the event?",
        updatedAt: new Date("2024-04-01T12:00:00Z"),
      },
      {
        sender: "67de63610a5186fe23edfdd7",
        receiver: "user2",
        message: "Yes, I'll be there!",
        updatedAt: new Date("2024-04-01T12:00:00Z"),
      },
    ],
  },
  {
    _id: "2",
    participants: ["67de63610a5186fe23edfdd7", "user4"],
    messages: [
      {
        sender: "67de63610a5186fe23edfdd7",
        receiver: "user2",
        message: "Hey, are you coming to the event?",
        updatedAt: new Date("2024-04-01T12:00:00Z"),
      },
      {
        sender: "67de63610a5186fe23edfdd7",
        receiver: "user2",
        message: "Yes, I'll be there!",
        updatedAt: new Date("2024-04-01T12:00:00Z"),
      },
    ],
  },
  {
    _id: "3",
    participants: ["67de63610a5186fe23edfdd7", "user6"],
    messages: [
      {
        sender: "67de63610a5186fe23edfdd7",
        message: "Check this out!",
        updatedAt: new Date("2024-04-01T12:00:00Z"),
      },
      {
        sender: "67de63610a5186fe23edfdd7",
        message: "Wow, that's amazing!",
        updatedAt: new Date("2024-04-01T12:00:00Z"),
      },
    ],
  },
];

const SupportsPage = () => {
  const [activeChat, setActiveChat] = useState(conversations[0]);

  return (
    <>
      <Helmet title="Supports · CS2Boost" />
      <div>
        <Heading
          icon={BiSupport}
          title="Support"
          subtitle="List of all your products and services."
        />
        <main className="mt-8 flex h-[680px] justify-center">
          {/* SIDEBAR */}
          <div className="w-1/3 bg-card-alt p-4">
            <h2 className="mb-4 text-lg font-bold">Conversations</h2>
            <ul className="space-y-2">
              {conversations.map((chat) => (
                <li
                  key={chat._id}
                  onClick={() => setActiveChat(chat)}
                  className={`cursor-pointer rounded-lg p-3 transition-colors ${
                    activeChat._id === chat._id
                      ? "bg-primary"
                      : "hover:bg-accent/50"
                  }`}
                >
                  <p className="font-medium">{chat.participants.join(", ")}</p>
                  <p className="truncate text-sm text-gray-500">
                    {chat.messages[chat.messages.length - 1].message}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* CHAT WINDOW */}
          <div className="flex w-2/3 flex-col p-6">
            <h2 className="mb-4 border-b pb-2 text-xl font-bold">
              Your help request: I have an alert that my account may have been
              accessed by someone else
            </h2>
            <div>
              <Conversation {...conversations[0]} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default SupportsPage;
