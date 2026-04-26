"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      remove: (widgetId: string) => void;
      render: (
        container: HTMLElement,
        options: {
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback": () => void;
          sitekey: string;
          theme?: "auto" | "dark" | "light";
          "timeout-callback"?: () => void;
          "unsupported-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_ID = "cf-turnstile-script";

function loadTurnstileScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);

  if (existingScript) {
    return new Promise<void>((resolve) => {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      if (window.turnstile) {
        resolve();
      }
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => {
      reject(new Error("Turnstile script took too long to load."));
    }, 10000);
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("Unable to load Turnstile."));
    };
    document.head.appendChild(script);
  });
}

export function TurnstileWidget({
  onError,
  onToken,
  resetKey,
  siteKey,
}: Readonly<{
  onError: () => void;
  onToken: (token: string) => void;
  resetKey: number;
  siteKey?: string;
}>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onErrorRef = useRef(onError);
  const onTokenRef = useRef(onToken);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    onErrorRef.current = onError;
    onTokenRef.current = onToken;
  }, [onError, onToken]);

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      return;
    }

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) {
          return;
        }

        if (widgetIdRef.current) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          "error-callback": () => onErrorRef.current(),
          "expired-callback": () => onErrorRef.current(),
          "timeout-callback": () => onErrorRef.current(),
          "unsupported-callback": () => onErrorRef.current(),
          callback: (token) => onTokenRef.current(token),
          sitekey: siteKey,
          theme: "light",
        });
      })
      .catch(() => onErrorRef.current());

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [resetKey, siteKey]);

  if (!siteKey) {
    return null;
  }

  return (
    <div className="flex min-h-[4.25rem] justify-center">
      <div ref={containerRef} />
    </div>
  );
}
