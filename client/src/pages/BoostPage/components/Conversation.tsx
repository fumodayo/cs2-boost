import { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { formatDistanceToNow } from "date-fns";
import { IMessage } from "~/types";
import { isUserObject } from "~/utils/typeGuards";
import { Spinner } from "~/components/ui";
import { FiX } from "react-icons/fi";
const ImageLightbox = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <FiX size={24} />
      </button>
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
        />
        {images.length > 1 && (
          <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onNavigate(index)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
        {images.length > 1 && currentIndex > 0 && (
          <button
            onClick={() => onNavigate(currentIndex - 1)}
            className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            ‹
          </button>
        )}
        {images.length > 1 && currentIndex < images.length - 1 && (
          <button
            onClick={() => onNavigate(currentIndex + 1)}
            className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 translate-x-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};
const ImageGrid = ({ images }: { images: string[] }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  if (!images || images.length === 0) return null;
  const gridClass =
    images.length === 1
      ? "grid-cols-1"
      : images.length === 2
        ? "grid-cols-2"
        : images.length === 3
          ? "grid-cols-2"
          : "grid-cols-2";
  return (
    <>
      <div className={`mt-2 grid gap-1 ${gridClass}`}>
        {images.slice(0, 4).map((img, index) => (
          <div
            key={index}
            className={`relative cursor-pointer overflow-hidden rounded-lg ${
              images.length === 3 && index === 0 ? "col-span-2" : ""
            }`}
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={img}
              alt={`Attachment ${index + 1}`}
              className="h-auto max-h-48 w-full object-cover transition-transform hover:scale-105"
            />
            {images.length > 4 && index === 3 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xl font-bold text-white">
                +{images.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
};
const SentMessage = ({
  message,
  images,
  updatedAt,
}: {
  message: string;
  images?: string[];
  updatedAt: string;
}) => (
  <div className="flex justify-end">
    <div className="my-1 flex max-w-lg flex-col rounded-lg bg-primary px-3 py-2 text-primary-foreground">
      {message && <p className="whitespace-pre-wrap text-sm">{message}</p>}
      <ImageGrid images={images || []} />
      <span className="self-end pt-1 text-[10px] text-primary-foreground/75">
        {formatDistanceToNow(updatedAt, { addSuffix: true })}
      </span>
    </div>
  </div>
);
const ReceivedMessage = ({
  message,
  images,
  updatedAt,
}: {
  message: string;
  images?: string[];
  updatedAt: string;
}) => (
  <div className="flex justify-start">
    <div className="my-1 flex max-w-lg flex-col rounded-lg bg-muted px-3 py-2 text-foreground">
      {message && <p className="whitespace-pre-wrap text-sm">{message}</p>}
      <ImageGrid images={images || []} />
      <span className="self-end pt-1 text-[10px] text-muted-foreground/75">
        {formatDistanceToNow(updatedAt, { addSuffix: true })}
      </span>
    </div>
  </div>
);
const Conversation = ({ messages }: { messages: IMessage[] }) => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const scrollAnchorRef = useRef<null | HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (scrollAnchorRef.current) {
      scrollAnchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);
  if (!currentUser) {
    return <Spinner />;
  }
  return (
    <div className="flex flex-col space-y-2">
      {messages.map((msg: IMessage) => {
        const senderId = isUserObject(msg.sender) ? msg.sender._id : msg.sender;
        const isSentByMe = String(senderId) === String(currentUser._id);
        return isSentByMe ? (
          <SentMessage key={msg._id} {...msg} />
        ) : (
          <ReceivedMessage key={msg._id} {...msg} />
        );
      })}
      <div ref={scrollAnchorRef} />
    </div>
  );
};
export default Conversation;