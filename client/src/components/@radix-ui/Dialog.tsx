import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";
import { Button } from "../shared";
import { HiXMark } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogClose = DialogPrimitive.Close;

export const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DialogPrimitive.Content>
>(({ children, title, ...props }, forwardRef) => {
  const { t } = useTranslation();

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-close fixed inset-0 z-40 bg-background/80" />
      <DialogPrimitive.Content
        // onPointerDownOutside={(e) => e.preventDefault()}
        className="data-[state=open]:animate-modal-show data-[state=closed]:animate-modal-close scroll-sm fixed top-1/2 z-40 mx-auto min-h-fit w-full -translate-y-1/2 rounded-xl text-left shadow-xl outline-none ring-1 ring-border transition-all focus:outline-none sm:left-1/2 sm:max-w-4xl sm:-translate-x-1/2"
        {...props}
        ref={forwardRef}
      >
        <DialogPrimitive.Title className="font-display text-lg font-medium text-foreground">
          {title && t(`Dialog.title.${title}`)}
        </DialogPrimitive.Title>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const EditDialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof DialogPrimitive.Content>
>(({ children, title, ...props }, forwardRef) => {
  const { t } = useTranslation();

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-close fixed inset-0 z-40 bg-background/80" />
      <DialogPrimitive.Content
        className="data-[state=closed]:animate-slideover-close data-[state=open]:animate-slideover-show fixed right-0 top-0 z-40 mx-auto h-[100dvh] w-full overflow-auto rounded-none bg-card-alt text-left shadow-sm outline-none transition-all focus:outline-none sm:max-w-lg sm:rounded-l-xl sm:ring-1 sm:ring-border md:right-3 md:top-3 md:h-[calc(100svh-1.5rem)] md:rounded-xl"
        {...props}
        ref={forwardRef}
      >
        <div className="flex h-full flex-col">
          {/* HEADER */}
          <div className="border-b border-border px-4 py-6 sm:px-6">
            <div className="flex items-start justify-between">
              <DialogPrimitive.Title className="font-display text-lg font-medium text-foreground">
                {t(`Dialog.title.${title}`)}
              </DialogPrimitive.Title>
              <DialogPrimitive.Close>
                <div className="ml-3 flex h-7 items-center">
                  <Button
                    variant="transparent"
                    className="h-8 w-8 rounded-full p-1 text-sm"
                  >
                    <span className="sr-only">Close</span>
                    <HiXMark
                      size={34}
                      className="flex items-center justify-center text-muted-foreground"
                    />
                  </Button>
                </div>
              </DialogPrimitive.Close>
            </div>
          </div>
          {/* CONTENT & FOOTER */}
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

interface IAlertDialogContentProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  title?: string;
  subtitle?: string;
}

export const AlertDialogContent = React.forwardRef<
  HTMLDivElement,
  IAlertDialogContentProps
>(({ children, title, subtitle, ...props }, forwardRef) => {
  const { t } = useTranslation();

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full"
        onPointerDownOutside={(e) => e.preventDefault()}
        {...props}
        ref={forwardRef}
      >
        {/* HEADER */}
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
            {t(`Dialog.title.${title}`)}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-muted-foreground">
            {t(`Dialog.subtitle.${subtitle}`)}
          </DialogPrimitive.Description>
        </div>
        {/* CONTENT */}
        <div className="mt-3.5 flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

interface INotifyDialogProps
  extends React.ComponentProps<typeof DialogPrimitive.Content> {
  image?: string;
  title?: string;
  subtitle?: string;
}

export const NotifyDialog = React.forwardRef<
  HTMLDivElement,
  INotifyDialogProps
>(({ children, image, title, subtitle, ...props }, forwardRef) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 text-center shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
      {...props}
      ref={forwardRef}
    >
      {/* HEADER */}

      {image && (
        <img
          src={image}
          alt="Notify Image"
          className="mx-auto mb-4 h-20 w-20"
        />
      )}
      <div>
        <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
          {title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="text-sm text-muted-foreground">
          {subtitle}
        </DialogPrimitive.Description>
      </div>

      {/* CONTENT */}
      <div className="mt-4 space-y-2">{children}</div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
