"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#3f2d23]/40 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[min(92vw,32rem)] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-lg)] border border-white/80 bg-[#fff9f3] p-6 shadow-[0_24px_80px_rgba(80,52,35,0.24)]",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-full border border-[#d8c4b2]/70 bg-white/88 p-2 text-[#5f3f2f] shadow-[0_8px_20px_rgba(0,0,0,0.18)] backdrop-blur transition hover:border-[#ff1f2d] hover:bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] hover:text-white hover:shadow-[0_0_22px_rgba(255,31,45,0.62),0_8px_20px_rgba(224,0,18,0.42)]">
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({
  children,
  className,
}: React.ComponentProps<"div">) {
  return <div className={cn("space-y-3 pr-10", className)}>{children}</div>;
}

export function DialogTitle({
  children,
  className,
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title className={cn("font-display text-2xl font-semibold text-foreground", className)}>
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({
  children,
  className,
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description className={cn("text-sm leading-6 text-muted-foreground", className)}>
      {children}
    </DialogPrimitive.Description>
  );
}
