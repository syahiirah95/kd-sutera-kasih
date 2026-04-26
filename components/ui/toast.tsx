"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastVariant = "error" | "info" | "success";

type ToastItem = {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant;
};

type ToastInput = {
  message: string;
  title?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function createToastId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ message, title, variant = "info" }: ToastInput) => {
      const id = createToastId();
      setToasts((currentToasts) => [
        ...currentToasts.slice(-3),
        {
          id,
          message,
          title,
          variant,
        },
      ]);
      window.setTimeout(() => removeToast(id), 5200);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[80] grid w-[min(92vw,22rem)] gap-2">
        {toasts.map((toastItem) => (
          <div
            className={cn(
              "pointer-events-auto rounded-[var(--radius-sm)] border border-[#f0c46c]/55 bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] p-3 text-sm text-white shadow-[0_14px_34px_rgba(184,111,41,0.34)] backdrop-blur",
              toastItem.variant === "error" &&
                "border-[#ff7a7f]/55 bg-[linear-gradient(135deg,#ff4b55_0%,#e00012_52%,#ff7a7f_100%)] shadow-[0_0_22px_rgba(255,31,45,0.24),0_14px_34px_rgba(224,0,18,0.26)]",
            )}
            key={toastItem.id}
          >
            <div className="min-w-0">
              <div className="flex min-h-5 items-start justify-between gap-3">
                {toastItem.title ? (
                  <p className="font-semibold leading-5 text-white">{toastItem.title}</p>
                ) : (
                  <span />
                )}
                <button
                  aria-label="Dismiss notification"
                  className={cn(
                    "inline-flex size-5 shrink-0 items-center justify-center bg-transparent text-[15px] font-semibold leading-none transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
                    toastItem.variant === "error" ? "text-white" : "text-[#ff1f2d]",
                  )}
                  onClick={() => removeToast(toastItem.id)}
                  type="button"
                >
                  <span aria-hidden="true">✘</span>
                </button>
              </div>
              <p className="mt-0.5 leading-5 text-white/88">{toastItem.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
