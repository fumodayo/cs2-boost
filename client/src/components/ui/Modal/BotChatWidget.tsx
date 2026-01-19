"use client";
import {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  useLayoutEffect,
} from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { IoMdSend } from "react-icons/io";
import { HiXMark } from "react-icons/hi2";
import { useBotChat } from "~/hooks/useBotChat";
import { useLiveChat } from "~/hooks/useLiveChat";
import { useGuestLiveChat } from "~/hooks/useGuestLiveChat";
import { IBotMessage, IMessage, IUser } from "~/types";
import { Spinner } from "~/components/ui/Feedback";
import { Button } from "../Button";
import {
  IoChatbubbleEllipsesOutline,
  IoImageOutline,
  IoChevronBack,
  IoChevronDown,
  IoEllipsisVertical,
  IoHomeOutline,
  IoChatbubblesOutline,
  IoNotificationsOffOutline,
  IoNotificationsOutline,
  IoPerson,
} from "react-icons/io5";
import { Dialog, DialogTrigger } from "~/components/@radix-ui/Dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { FiSend } from "react-icons/fi";
import Tooltip from "~/components/@radix-ui/Tooltip";
import toast from "react-hot-toast";
import { isUserObject } from "~/utils/typeGuards";
interface FAQMessage {
  id: string;
  role: "user" | "bot";
  text: string;
  followUps?: string[];
  createdAt: string;
}
interface BotChatInputProps {
  onSendMessage: (message: string, file: File | null) => Promise<void>;
}
const ChatInput = ({ onSendMessage }: BotChatInputProps) => {
  const { t } = useTranslation();
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };
  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async () => {
    if (!messageInput.trim() && !file) return;
    setIsSending(true);
    try {
      await onSendMessage(messageInput, file);
      setMessageInput("");
      handleRemoveImage();
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn từ AI_ChatInput:", error);
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Image preview"
            className="h-24 w-24 rounded-lg object-cover"
          />
          <Button
            onClick={handleRemoveImage}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 text-white transition-transform hover:scale-110"
            aria-label="Remove image"
          >
            <HiXMark size={16} />
          </Button>
        </div>
      )}
      {/* Input field */}
      <input
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !isSending && handleSubmit()}
        placeholder={t("ai_chat.placeholder")}
        className="w-full border-0 bg-transparent px-0 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
        disabled={isSending}
      />
      {/* Bottom icons row */}
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            id="ai-chat-file-upload"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            type="button"
          >
            <IoImageOutline size={20} />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            type="button"
          >
            <span className="text-lg">😊</span>
          </button>
        </div>
        <Button
          disabled={isSending || (!messageInput.trim() && !file)}
          onClick={handleSubmit}
          variant="ghost"
          className="h-8 w-8 flex-shrink-0 rounded-full p-0 text-muted-foreground hover:text-primary disabled:opacity-30"
        >
          <span className="sr-only">Send Message</span>
          <IoMdSend size={18} />
        </Button>
      </div>
    </div>
  );
};
interface QuickRepliesProps {
  followUpKeys: string[];
  onSelectQuestion: (key: string) => void;
}
const QuickReplies = ({
  followUpKeys,
  onSelectQuestion,
}: QuickRepliesProps) => {
  const { t } = useTranslation();
  if (!followUpKeys || followUpKeys.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {followUpKeys.map((key) => (
        <button
          key={key}
          onClick={() => onSelectQuestion(key)}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-all hover:border-primary hover:bg-primary/10 hover:text-primary"
        >
          {t(`ai_chat.suggested_questions.${key}`)}
        </button>
      ))}
    </div>
  );
};
const BotTypingIndicator = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 self-start">
      <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-2">
        <span className="text-sm font-medium text-primary">
          {t("ai_chat.ai_typing")}
        </span>
        <div className="flex items-center space-x-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></span>
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></span>
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"></span>
        </div>
      </div>
    </div>
  );
};
interface SuggestedQuestionsPanelProps {
  onSelectQuestion: (key: string) => void;
  onStartChat: () => void;
}
const SuggestedQuestionsPanel = ({
  onSelectQuestion,
  onStartChat,
}: SuggestedQuestionsPanelProps) => {
  const { t } = useTranslation();
  const suggestedQuestions = [
    { key: "is_legit" },
    { key: "how_to_sell" },
    { key: "account_terms" },
    { key: "refund_policy" },
  ];
  return (
    <div className="flex h-full flex-col">
      {/* Header with banner image background */}
      <div className="relative flex-shrink-0 overflow-hidden px-4 pb-8 pt-4">
        {/* Banner background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("/assets/games/valorant/banner.png")`,
          }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        {/* Header actions */}
        <div className="relative mb-6 flex items-center justify-between">
          {/* Avatar */}
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#1a1a2e] shadow-lg ring-2 ring-white/20">
            <img
              src="/assets/brand/icon-text-dark.png"
              alt="CS2 Boost"
              className="h-8 w-8 object-contain"
            />
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <IoEllipsisVertical className="h-5 w-5" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
              <IoChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
        {/* Greeting text */}
        <h2 className="relative text-2xl font-bold text-white drop-shadow-lg">
          {t("ai_chat.hi_there")} <span className="text-blue-400">💙</span>
        </h2>
        <p className="relative mt-1 text-white/90 drop-shadow-md">
          {t("ai_chat.how_can_we_help")}
        </p>
      </div>
      {/* Suggested questions - card style with rounded corners */}
      <div className="relative -mt-4 min-h-0 flex-1 overflow-y-auto rounded-t-3xl bg-card p-4 pt-5 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
        <div className="space-y-2">
          {suggestedQuestions.map((question) => (
            <button
              key={question.key}
              onClick={() => onSelectQuestion(question.key)}
              className="flex w-full items-center justify-between border-b border-border/50 px-2 py-3.5 text-left transition-all last:border-b-0 hover:bg-muted/50"
            >
              <span className="text-sm font-medium text-foreground">
                {t(`ai_chat.suggested_questions.${question.key}`)}
              </span>
              <IoChevronDown className="-rotate-90 text-muted-foreground" />
            </button>
          ))}
        </div>
        {/* Chat with us button */}
        <button
          onClick={onStartChat}
          className="mt-4 flex w-full items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3.5 text-left transition-all hover:bg-muted/50"
        >
          <span className="text-sm font-medium text-foreground">
            {t("ai_chat.chat_with_us")}
          </span>
          <FiSend className="text-primary" />
        </button>
      </div>
      {/* Bottom navigation tabs - fixed at bottom */}
      <div className="flex flex-shrink-0 border-t border-border bg-card">
        <button className="flex flex-1 flex-col items-center gap-1 py-3 text-primary">
          <IoHomeOutline className="h-5 w-5" />
          <span className="text-xs font-medium">{t("ai_chat.tabs.home")}</span>
        </button>
        <button
          onClick={onStartChat}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-muted-foreground transition-colors hover:text-foreground"
        >
          <IoChatbubblesOutline className="h-5 w-5" />
          <span className="text-xs font-medium">{t("ai_chat.tabs.chat")}</span>
        </button>
      </div>
    </div>
  );
};
interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}
const OptionsMenu = ({
  isOpen,
  onClose,
  notificationsEnabled,
  onToggleNotifications,
}: OptionsMenuProps) => {
  const { t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-xl border border-border bg-card p-1 shadow-lg"
    >
      <button
        onClick={() => {
          onToggleNotifications();
          onClose();
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted"
      >
        {notificationsEnabled ? (
          <IoNotificationsOffOutline className="h-5 w-5" />
        ) : (
          <IoNotificationsOutline className="h-5 w-5" />
        )}
        <span>
          {notificationsEnabled
            ? t("ai_chat.turn_off_notifications")
            : t("ai_chat.turn_on_notifications")}
        </span>
      </button>
    </div>
  );
};
const formatTimestamp = (dateString: string, t: (key: string) => string) => {
  const date = new Date(dateString);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (isToday) {
    return `${t("ai_chat.today")}, ${timeStr}`;
  }
  return `${date.toLocaleDateString()}, ${timeStr}`;
};
const BotChatWidget = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [liveChatMode, setLiveChatMode] = useState(false);
  const [liveChatInput, setLiveChatInput] = useState("");
  const [isCreatingLiveChat, setIsCreatingLiveChat] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [faqMessages, setFaqMessages] = useState<FAQMessage[]>(() => {
    try {
      const saved = localStorage.getItem("cs2boost_faq_messages");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading FAQ messages from localStorage:", error);
    }
    return [];
  });
  const isAdminPage = location.pathname.startsWith("/admin");
  const {
    messages,
    isLoading: isLoadingHistory,
    isBotTyping,
    handleSendMessage,
  } = useBotChat();
  const {
    liveChat,
    messages: liveChatMessages,
    isLoading: isLoadingLiveChat,
    isOpen: hasActiveLiveChat,
    isWaiting,
    isConnected,
    createChat,
    sendMessage: sendLiveChatMessage,
    closeChat,
  } = useLiveChat(currentUser);
  const {
    guestEmail,
    liveChat: guestLiveChat,
    messages: guestLiveChatMessages,
    isLoading: isLoadingGuestLiveChat,
    isOpen: hasActiveGuestLiveChat,
    isWaiting: isGuestWaiting,
    isConnected: isGuestConnected,
    createChat: createGuestChat,
    sendMessage: sendGuestLiveChatMessage,
  } = useGuestLiveChat();
  const activeLiveChat = currentUser ? liveChat : guestLiveChat;
  const activeLiveChatMessages = currentUser
    ? liveChatMessages
    : guestLiveChatMessages;
  const isActiveLiveChatLoading = currentUser
    ? isLoadingLiveChat
    : isLoadingGuestLiveChat;
  const hasAnyActiveLiveChat = currentUser
    ? hasActiveLiveChat
    : hasActiveGuestLiveChat;
  const isActiveChatWaiting = currentUser ? isWaiting : isGuestWaiting;
  const isActiveChatConnected = currentUser ? isConnected : isGuestConnected;
  const scrollAnchorRef = useRef<null | HTMLDivElement>(null);
  useEffect(() => {
    try {
      localStorage.setItem(
        "cs2boost_faq_messages",
        JSON.stringify(faqMessages),
      );
    } catch (error) {
      console.error("Error saving FAQ messages to localStorage:", error);
    }
  }, [faqMessages]);
  useEffect(() => {
    if (messages.length > 0 || faqMessages.length > 0) {
      setShowSuggestions(false);
    }
  }, [messages, faqMessages]);
  useLayoutEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, faqMessages, isLoadingHistory, isBotTyping]);
  const prevMessagesLenRef = useRef(messages.length);
  const prevFaqLenRef = useRef(faqMessages.length);
  const prevLiveChatLenRef = useRef(activeLiveChatMessages.length);
  const isFirstLoadRef = useRef(true);
  useEffect(() => {
    if (isFirstLoadRef.current) {
      isFirstLoadRef.current = false;
      prevMessagesLenRef.current = messages.length;
      prevFaqLenRef.current = faqMessages.length;
      prevLiveChatLenRef.current = activeLiveChatMessages.length;
      return;
    }
    if (!notificationsEnabled) {
      prevMessagesLenRef.current = messages.length;
      prevFaqLenRef.current = faqMessages.length;
      prevLiveChatLenRef.current = activeLiveChatMessages.length;
      return;
    }
    const playSound = () => {
      const audio = new Audio("/assets/sounds/ting.mp3");
      audio.play().catch((e) => console.error("Error playing sound:", e));
    };
    let shouldPlay = false;
    if (messages.length > prevMessagesLenRef.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.role === "model") {
        shouldPlay = true;
      }
    }
    prevMessagesLenRef.current = messages.length;
    if (faqMessages.length > prevFaqLenRef.current) {
      const lastMsg = faqMessages[faqMessages.length - 1];
      if (lastMsg && lastMsg.role === "bot") {
        shouldPlay = true;
      }
    }
    prevFaqLenRef.current = faqMessages.length;
    if (activeLiveChatMessages.length > prevLiveChatLenRef.current) {
      const lastMsg = activeLiveChatMessages[activeLiveChatMessages.length - 1];
      if (lastMsg) {
        let isCurrentUser = false;
        const sender = lastMsg.sender;
        if (currentUser) {
          isCurrentUser = isUserObject(sender)
            ? sender._id === currentUser._id
            : sender === currentUser._id;
        } else {
          isCurrentUser =
            !sender ||
            (sender &&
              typeof sender === "object" &&
              "guestEmail" in sender &&
              (sender as { guestEmail?: string }).guestEmail === guestEmail) ||
            lastMsg.guestEmail === guestEmail;
          if (isUserObject(sender) && (sender as IUser).role) {
            isCurrentUser = false;
          }
        }
        if (!isCurrentUser) {
          shouldPlay = true;
        }
      }
    }
    prevLiveChatLenRef.current = activeLiveChatMessages.length;
    if (shouldPlay) {
      playSound();
    }
  }, [
    messages,
    faqMessages,
    activeLiveChatMessages,
    notificationsEnabled,
    currentUser,
    guestEmail,
  ]);
  const handleFAQQuestion = (questionKey: string) => {
    const questionText = t(`ai_chat.suggested_questions.${questionKey}`);
    const answerText = t(`ai_chat.faq_answers.${questionKey}`);
    const followUps = t(`ai_chat.faq_follow_ups.${questionKey}`, {
      returnObjects: true,
    }) as string[];
    const userMessage: FAQMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: questionText,
      createdAt: new Date().toISOString(),
    };
    const botMessage: FAQMessage = {
      id: `bot-${Date.now()}`,
      role: "bot",
      text: answerText,
      followUps: Array.isArray(followUps) ? followUps : [],
      createdAt: new Date().toISOString(),
    };
    setFaqMessages((prev) => [...prev, userMessage, botMessage]);
    setShowSuggestions(false);
  };
  const performSendMessage = async (message: string, file: File | null) => {
    setShowSuggestions(false);
    await handleSendMessage(message, file);
  };
  const handleSelectQuestion = (key: string) => {
    handleFAQQuestion(key);
  };
  const handleStartChat = () => {
    setShowSuggestions(false);
  };
  const handleBackToSuggestions = () => {
    if (liveChatMode) {
      setLiveChatMode(false);
    } else {
      setShowSuggestions(true);
    }
  };
  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  const handleSwitchToLiveChat = () => {
    if (hasAnyActiveLiveChat) {
      setLiveChatMode(true);
      return;
    }
    if (!currentUser) {
      if (guestEmail) {
        setLiveChatMode(true);
      } else {
        setShowEmailForm(true);
      }
      return;
    }
    setLiveChatMode(true);
  };
  const handleEmailSubmit = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput)) {
      toast.error(t("ai_chat.invalid_email"));
      return;
    }
    setShowEmailForm(false);
    setLiveChatMode(true);
  };
  const handleCreateLiveChat = async () => {
    if (!liveChatInput.trim()) {
      toast.error(t("ai_chat.message_required"));
      return;
    }
    setIsCreatingLiveChat(true);
    try {
      if (currentUser) {
        await createChat(t("ai_chat.support_request"), liveChatInput.trim());
      } else {
        const email = emailInput || guestEmail;
        if (!email) {
          toast.error(t("ai_chat.email_required"));
          setShowEmailForm(true);
          setLiveChatMode(false);
          return;
        }
        await createGuestChat(
          t("ai_chat.support_request"),
          liveChatInput.trim(),
          email,
        );
      }
      setLiveChatInput("");
      setEmailInput("");
      toast.success(t("ai_chat.live_chat_created"));
    } catch {
      toast.error(t("ai_chat.live_chat_failed"));
    } finally {
      setIsCreatingLiveChat(false);
    }
  };
  const handleSendLiveChatMsg = async (message: string) => {
    if (!message.trim()) return;
    try {
      if (currentUser) {
        await sendLiveChatMessage(message.trim());
      } else {
        await sendGuestLiveChatMessage(message.trim());
      }
    } catch {
      toast.error(t("ai_chat.send_failed"));
    }
  };
  const handleCloseLiveChat = async () => {
    try {
      if (currentUser) {
        await closeChat();
      } else {
        setLiveChatMode(false);
      }
      setLiveChatMode(false);
      toast.success(t("ai_chat.chat_closed"));
    } catch {
      toast.error(t("ai_chat.close_failed"));
    }
  };
  const getAdminName = () => {
    if (activeLiveChat?.admin && isUserObject(activeLiveChat.admin)) {
      return (activeLiveChat.admin as IUser).username;
    }
    return t("ai_chat.support_team");
  };
  if (isAdminPage) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label={t("ai_chat.open_chat")}
        >
          <IoChatbubbleEllipsesOutline className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="light fixed inset-x-0 bottom-0 z-50 flex h-[90vh] max-h-[700px] w-full flex-col overflow-hidden rounded-t-xl border-0 p-0 shadow-2xl transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-md sm:rounded-xl"
          style={
            {
              "--background": "0 0% 100%",
              "--foreground": "222.2 84% 4.9%",
              "--card": "0 0% 100%",
              "--card-foreground": "222.2 84% 4.9%",
              "--muted": "210 40% 96.1%",
              "--muted-foreground": "215.4 16.3% 46.9%",
              "--border": "214.3 31.8% 91.4%",
              "--primary": "221.2 83.2% 53.3%",
              "--primary-foreground": "210 40% 98%",
              backgroundColor: "hsl(0 0% 100%)",
              color: "hsl(222.2 84% 4.9%)",
            } as React.CSSProperties
          }
        >
          {showSuggestions ? (
            <SuggestedQuestionsPanel
              onSelectQuestion={handleSelectQuestion}
              onStartChat={handleStartChat}
            />
          ) : (
            <>
              {/* Chat header */}
              <div className="flex flex-shrink-0 items-center justify-between bg-primary px-4 py-3">
                <div className="flex items-center gap-3">
                  <Tooltip content={t("ai_chat.go_back")}>
                    <button
                      onClick={handleBackToSuggestions}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <IoChevronBack className="h-5 w-5" />
                    </button>
                  </Tooltip>
                  <h3 className="text-lg font-semibold text-white">
                    {t("ai_chat.hi_there")}{" "}
                    <span className="text-primary-foreground">💚</span>
                  </h3>
                </div>
                <div className="relative flex items-center gap-1">
                  <Tooltip
                    content={
                      showOptionsMenu
                        ? t("ai_chat.close_options")
                        : t("ai_chat.open_options")
                    }
                  >
                    <button
                      onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <IoEllipsisVertical className="h-5 w-5" />
                    </button>
                  </Tooltip>
                  <Tooltip content={t("ai_chat.minimize")}>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <IoChevronDown className="h-5 w-5" />
                    </button>
                  </Tooltip>
                  {/* Options dropdown */}
                  <OptionsMenu
                    isOpen={showOptionsMenu}
                    onClose={() => setShowOptionsMenu(false)}
                    notificationsEnabled={notificationsEnabled}
                    onToggleNotifications={handleToggleNotifications}
                  />
                </div>
              </div>
              {/* Chat messages */}
              <div
                className="min-h-0 flex-1 bg-background p-4 pr-2"
                style={{ overflowY: "auto" }}
              >
                {isLoadingHistory ? (
                  <div className="flex h-full items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* Initial greeting */}
                    <div className="max-w-[85%] self-start rounded-xl border-l-4 border-primary bg-card p-4 shadow-md">
                      <p className="m-0 whitespace-pre-wrap break-words text-foreground">
                        {t("ai_chat.greeting")}
                      </p>
                    </div>
                    {/* FAQ Messages */}
                    {faqMessages.map((msg) => {
                      return (
                        <div key={msg.id} className="flex flex-col gap-1">
                          <div
                            className={`max-w-[85%] rounded-xl p-4 ${
                              msg.role === "user"
                                ? "self-end bg-primary text-primary-foreground shadow-md"
                                : "self-start border-l-4 border-primary bg-card text-foreground shadow-md"
                            }`}
                          >
                            <p className="m-0 whitespace-pre-wrap break-words">
                              {msg.text}
                            </p>
                          </div>
                          {/* Timestamp for bot messages */}
                          {msg.role === "bot" && (
                            <span className="ml-1 text-xs text-muted-foreground">
                              {t("ai_chat.ai_agent")} -{" "}
                              {formatTimestamp(msg.createdAt, t)}
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {/* AI Messages */}
                    {messages.map((msg: IBotMessage) => (
                      <div key={msg._id} className="flex flex-col gap-1">
                        <div
                          className={`max-w-[85%] rounded-xl p-4 ${
                            msg.role === "user"
                              ? "self-end bg-primary text-primary-foreground shadow-md"
                              : "self-start border-l-4 border-primary bg-card text-foreground shadow-md"
                          }`}
                        >
                          <p className="m-0 whitespace-pre-wrap break-words">
                            {msg.text}
                          </p>
                          {(msg.imageUrl || msg.filePreview) && (
                            <img
                              src={msg.imageUrl || msg.filePreview}
                              alt="Uploaded content"
                              className="mt-2 inline-block max-w-[200px] rounded-lg"
                            />
                          )}
                        </div>
                        {/* Timestamp for AI messages */}
                        {msg.role === "model" && msg.createdAt && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            {t("ai_chat.ai_agent")} -{" "}
                            {formatTimestamp(msg.createdAt, t)}
                          </span>
                        )}
                      </div>
                    ))}
                    {/* Follow-up suggestions - at the end of all messages */}
                    {faqMessages.length > 0 &&
                      (() => {
                        const lastBotMessage = [...faqMessages]
                          .reverse()
                          .find((m) => m.role === "bot");
                        if (
                          lastBotMessage &&
                          lastBotMessage.followUps &&
                          lastBotMessage.followUps.length > 0
                        ) {
                          return (
                            <div className="ml-1">
                              <QuickReplies
                                followUpKeys={lastBotMessage.followUps}
                                onSelectQuestion={handleSelectQuestion}
                              />
                            </div>
                          );
                        }
                        return null;
                      })()}
                    {isBotTyping && <BotTypingIndicator />}
                    <div ref={scrollAnchorRef} />
                  </div>
                )}
              </div>
              {/* Chat input - fixed at bottom */}
              {/* Chat input - fixed at bottom */}
              {liveChatMode ? (
                <div className="flex flex-col border-t border-border bg-card">
                  {/* Live Chat Header */}
                  <div className="flex items-center justify-between border-b border-border bg-success/10 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <IoPerson className="h-5 w-5 text-success" />
                      <span className="text-sm font-medium text-success">
                        {hasAnyActiveLiveChat
                          ? isActiveChatConnected
                            ? t("ai_chat.connected_with", {
                                name: getAdminName(),
                              })
                            : isActiveChatWaiting
                              ? t("ai_chat.waiting_for_support")
                              : t("ai_chat.live_support")
                          : t("ai_chat.live_support")}
                      </span>
                    </div>
                    {hasAnyActiveLiveChat && (
                      <button
                        onClick={handleCloseLiveChat}
                        className="rounded px-2 py-1 text-xs text-danger hover:bg-danger/10"
                      >
                        {t("ai_chat.end_chat")}
                      </button>
                    )}
                  </div>
                  {/* Email Collection Form for Guest */}
                  {showEmailForm ? (
                    <div className="p-4">
                      <p className="mb-3 text-sm text-muted-foreground">
                        {t("ai_chat.enter_email_guest")}
                      </p>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="example@email.com"
                        className="mb-3 w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowEmailForm(false);
                            setLiveChatMode(false);
                          }}
                          className="flex-1 rounded-lg border border-border py-2 text-foreground hover:bg-muted"
                        >
                          {t("ai_chat.cancel")}
                        </button>
                        <button
                          onClick={handleEmailSubmit}
                          disabled={!emailInput.trim()}
                          className="flex-1 rounded-lg bg-success py-2 text-success-foreground hover:bg-success-hover disabled:opacity-50"
                        >
                          {t("ai_chat.continue")}
                        </button>
                      </div>
                    </div>
                  ) : hasAnyActiveLiveChat ? (
                    <>
                      <div className="max-h-[200px] overflow-y-auto p-3">
                        {isActiveLiveChatLoading ? (
                          <div className="flex justify-center py-4">
                            <Spinner />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {activeLiveChatMessages.map((msg: IMessage) => {
                              const sender = msg.sender;
                              let isCurrentUser = false;
                              if (currentUser) {
                                isCurrentUser = isUserObject(sender)
                                  ? sender._id === currentUser._id
                                  : sender === currentUser._id;
                              } else {
                                isCurrentUser =
                                  !sender ||
                                  (sender &&
                                    typeof sender === "object" &&
                                    "guestEmail" in sender &&
                                    (sender as { guestEmail?: string }) 
                                      .guestEmail === guestEmail) ||
                                  msg.guestEmail === guestEmail;
                                if (
                                  isUserObject(sender) &&
                                  (sender as IUser).role
                                ) {
                                  isCurrentUser = false;
                                }
                              }
                              return (
                                <div
                                  key={msg._id}
                                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                                    isCurrentUser
                                      ? "ml-auto bg-success text-success-foreground"
                                      : "bg-muted text-foreground"
                                  }`}
                                >
                                  {msg.message}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* Live Chat Input */}
                      <div className="border-t border-border p-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder={t("ai_chat.type_message")}
                            className="flex-1 rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && e.currentTarget.value) {
                                handleSendLiveChatMsg(e.currentTarget.value);
                                e.currentTarget.value = "";
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const input = e.currentTarget
                                .previousSibling as HTMLInputElement;
                              if (input.value) {
                                handleSendLiveChatMsg(input.value);
                                input.value = "";
                              }
                            }}
                            className="rounded-lg bg-success px-4 py-2 text-success-foreground hover:bg-success-hover"
                          >
                            <IoMdSend />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4">
                      <p className="mb-3 text-sm text-muted-foreground">
                        {t("ai_chat.describe_issue")}
                      </p>
                      <textarea
                        value={liveChatInput}
                        onChange={(e) => setLiveChatInput(e.target.value)}
                        placeholder={t("ai_chat.issue_placeholder")}
                        rows={3}
                        className="mb-3 w-full resize-none rounded-lg border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none"
                      />
                      <button
                        onClick={handleCreateLiveChat}
                        disabled={isCreatingLiveChat || !liveChatInput.trim()}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-success py-2 text-success-foreground hover:bg-success-hover disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isCreatingLiveChat ? (
                          <Spinner />
                        ) : (
                          <>
                            <IoPerson className="h-4 w-4" />
                            {t("ai_chat.start_live_chat")}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mx-3 mb-3 flex-shrink-0">
                  <div className="mb-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm">
                    <ChatInput onSendMessage={performSendMessage} />
                  </div>
                  {/* Talk to Human Button */}
                  {currentUser && (
                    <button
                      onClick={handleSwitchToLiveChat}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-success/30 bg-success/10 py-2.5 text-sm font-medium text-success transition-colors hover:bg-success/20"
                    >
                      <IoPerson className="h-4 w-4" />
                      {hasActiveLiveChat
                        ? t("ai_chat.continue_live_chat")
                        : t("ai_chat.talk_to_human")}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
};
export default BotChatWidget;