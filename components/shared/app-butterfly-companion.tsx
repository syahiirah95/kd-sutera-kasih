"use client";

import { usePathname } from "next/navigation";
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { BookingStepperButterfly } from "@/components/booking/booking-stepper-butterfly";

type Point = {
  x: number;
  y: number;
};

const DEFAULT_FLY_DURATION_MS = 1800;
const FLY_SETTLE_BUFFER_MS = 220;

function usesDocumentAnchoredButterfly(pathname: string) {
  return pathname === "/venue" || pathname === "/privacy" || pathname === "/terms" || pathname === "/login" || pathname === "/signup" || pathname === "/disclaimer" || pathname === "/my-bookings" || pathname === "/account" || pathname === "/admin";
}

function shouldFaceAnchorText(pathname: string) {
  return pathname === "/venue" || pathname === "/privacy" || pathname === "/terms" || pathname === "/login" || pathname === "/signup" || pathname === "/disclaimer" || pathname === "/my-bookings" || pathname === "/account" || pathname === "/admin";
}

function isLeftDialogTitleAnchor(element: HTMLElement) {
  return (
    element.dataset.butterflyAnchor === "account-info-title" ||
    element.dataset.butterflyAnchor === "admin-dialog-title" ||
    element.dataset.butterflyAnchor === "booking-details-title" ||
    element.dataset.butterflyAnchor === "hall-availability-title" ||
    element.dataset.butterflyAnchor === "login-title" ||
    element.dataset.butterflyAnchor === "signup-title" ||
    element.dataset.butterflyAnchor === "payment-dialog-title"
  );
}

function isDialogAnchorElement(element: HTMLElement) {
  return Boolean(element.closest("[role='dialog']"));
}

function findAnchor(pathname: string): HTMLElement | null {
  const dialogAnchor = document.querySelector<HTMLElement>(
    "[role='dialog'] [data-butterfly-anchor='account-info-title'], [role='dialog'] [data-butterfly-anchor='admin-dialog-title'], [role='dialog'] [data-butterfly-anchor='booking-details-title'], [role='dialog'] [data-butterfly-anchor='hall-availability-title'], [role='dialog'] [data-butterfly-anchor='login-title'], [role='dialog'] [data-butterfly-anchor='signup-title'], [role='dialog'] [data-butterfly-anchor='payment-dialog-title']",
  );

  if (dialogAnchor) {
    return dialogAnchor;
  }

  if (pathname === "/booking") {
    const dialogAnchor = document.querySelector<HTMLElement>("[data-butterfly-anchor='layout-preview-title']");

    if (dialogAnchor) {
      return dialogAnchor;
    }

    return document.querySelector<HTMLElement>("[data-butterfly-step-label][data-butterfly-active='true']");
  }

  if (pathname === "/venue") {
    return document.querySelector<HTMLElement>("[data-butterfly-anchor='venue-title']");
  }

  if (pathname === "/login") {
    return document.querySelector<HTMLElement>("[data-butterfly-anchor='login-title']");
  }

  if (pathname === "/signup") {
    return document.querySelector<HTMLElement>("[data-butterfly-anchor='signup-title']");
  }

  if (pathname === "/my-bookings" || pathname === "/account") {
    return document.querySelector<HTMLElement>("[data-butterfly-anchor='my-bookings-title']");
  }

  if (pathname === "/admin" || pathname === "/disclaimer" || pathname === "/privacy" || pathname === "/terms") {
    const pageTitleAnchor =
      pathname === "/admin"
        ? "admin-title"
        : pathname === "/disclaimer"
        ? "disclaimer-title"
        : "legal-page-title";
    const pageAnchors = Array.from(
      document.querySelectorAll<HTMLElement>(`[data-butterfly-anchor='${pageTitleAnchor}'], [data-butterfly-anchor='section']`),
    );

    const targetY = 150;
    const visibleAnchor =
      pageAnchors
        .filter((element) => {
          const rect = element.getBoundingClientRect();
          return rect.bottom > 88 && rect.top < window.innerHeight * 0.72;
        })
        .sort((left, right) => {
          const leftDistance = Math.abs(left.getBoundingClientRect().top - targetY);
          const rightDistance = Math.abs(right.getBoundingClientRect().top - targetY);
          return leftDistance - rightDistance;
        })[0] ?? pageAnchors[0];

    return visibleAnchor ?? null;
  }

  const sectionAnchors = Array.from(
    document.querySelectorAll<HTMLElement>("[data-butterfly-anchor='section'], main h1, main h2"),
  );

  const visibleAnchor =
    sectionAnchors.find((element) => {
      const rect = element.getBoundingClientRect();
      return rect.bottom > 88 && rect.top < window.innerHeight * 0.62;
    }) ?? sectionAnchors[0];

  return visibleAnchor ?? null;
}

function getAnchorPoint(pathname: string, element: HTMLElement): Point {
  const rect = element.getBoundingClientRect();

  if (pathname === "/booking" && element.dataset.butterflyAnchor === "layout-preview-title") {
    return {
      x: rect.right + 22,
      y: rect.top + rect.height / 2 - 8,
    };
  }

  if (pathname === "/booking") {
    return {
      x: rect.left - 18,
      y: rect.top + rect.height / 2 - 6,
    };
  }

  if (pathname === "/venue" && element.dataset.butterflyAnchor === "venue-title") {
    return {
      x: rect.right + 24,
      y: rect.top + rect.height / 2 - 8,
    };
  }

  if (element.dataset.butterflyAnchor === "legal-title") {
    return {
      x: rect.right + 18,
      y: rect.top + rect.height / 2 - 6,
    };
  }

  if (isLeftDialogTitleAnchor(element)) {
    return {
      x: rect.left - 18,
      y: rect.top + rect.height / 2 - 6,
    };
  }

  if (element.dataset.butterflyAnchor === "my-bookings-title") {
    return {
      x: rect.right + 18,
      y: rect.top + rect.height / 2 - 6,
    };
  }

  return {
    x: rect.right + 22,
    y: rect.top + rect.height / 2 - 10,
  };
}

function getAnchorRestingDirection(pathname: string, element: HTMLElement): -1 | 1 {
  if (pathname === "/booking" || isLeftDialogTitleAnchor(element)) {
    return 1;
  }

  if (shouldFaceAnchorText(pathname)) {
    return -1;
  }

  return 1;
}

function hasMeaningfulMovement(current: Point | null, next: Point) {
  if (!current) {
    return true;
  }

  return Math.abs(current.x - next.x) > 2 || Math.abs(current.y - next.y) > 2;
}

function getRenderPoint(pathname: string, point: Point): Point {
  const anchor = findAnchor(pathname);

  if (!usesDocumentAnchoredButterfly(pathname) || (anchor && isDialogAnchorElement(anchor))) {
    return point;
  }

  return {
    x: point.x + window.scrollX,
    y: point.y + window.scrollY,
  };
}

function getPointerRenderPoint(pathname: string, event: PointerEvent | ReactPointerEvent<HTMLButtonElement>): Point {
  if (!usesDocumentAnchoredButterfly(pathname)) {
    return {
      x: event.clientX,
      y: event.clientY,
    };
  }

  return {
    x: event.clientX + window.scrollX,
    y: event.clientY + window.scrollY,
  };
}

function getFlightDurationMs(current: Point | null, next: Point) {
  if (!current) {
    return DEFAULT_FLY_DURATION_MS;
  }

  const distance = Math.hypot(current.x - next.x, current.y - next.y);
  return Math.min(3400, Math.max(2100, Math.round(1450 + distance * 8)));
}

function smoothStep(progress: number) {
  return progress * progress * progress * (progress * (progress * 6 - 15) + 10);
}

function cubicBezierPoint(start: Point, controlA: Point, controlB: Point, end: Point, progress: number): Point {
  const inverse = 1 - progress;
  const inverseSquared = inverse * inverse;
  const progressSquared = progress * progress;

  return {
    x:
      inverseSquared * inverse * start.x +
      3 * inverseSquared * progress * controlA.x +
      3 * inverse * progressSquared * controlB.x +
      progressSquared * progress * end.x,
    y:
      inverseSquared * inverse * start.y +
      3 * inverseSquared * progress * controlA.y +
      3 * inverse * progressSquared * controlB.y +
      progressSquared * progress * end.y,
  };
}

export function AppButterflyCompanion() {
  const pathname = usePathname();
  const flightFrameRef = useRef<number | null>(null);
  const flyTimeoutRef = useRef<number | null>(null);
  const dragOffsetRef = useRef<Point | null>(null);
  const hasEnteredRef = useRef(false);
  const renderPointRef = useRef<Point | null>(null);
  const [anchorPoint, setAnchorPoint] = useState<Point | null>(null);
  const [anchorRestingDirection, setAnchorRestingDirection] = useState<-1 | 1>(1);
  const [isDialogAnchor, setIsDialogAnchor] = useState(false);
  const [flightDurationMs, setFlightDurationMs] = useState(DEFAULT_FLY_DURATION_MS);
  const [flightDirection, setFlightDirection] = useState<-1 | 1>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [renderPoint, setRenderPoint] = useState<Point | null>(null);

  const setRenderedPoint = useCallback((point: Point) => {
    renderPointRef.current = point;
    setRenderPoint(point);
  }, []);

  const startFlying = useCallback((durationMs = DEFAULT_FLY_DURATION_MS) => {
    setFlightDurationMs(durationMs);
    setIsFlying(true);

    if (flyTimeoutRef.current) {
      window.clearTimeout(flyTimeoutRef.current);
    }

    flyTimeoutRef.current = window.setTimeout(() => {
      setIsFlying(false);
    }, durationMs + FLY_SETTLE_BUFFER_MS);
  }, []);

  const cancelFlightAnimation = useCallback(() => {
    if (flightFrameRef.current) {
      window.cancelAnimationFrame(flightFrameRef.current);
      flightFrameRef.current = null;
    }
  }, []);

  const flyToPoint = useCallback(
    (nextPoint: Point, durationMs = DEFAULT_FLY_DURATION_MS) => {
      const startPoint = renderPointRef.current;

      if (!startPoint) {
        setRenderedPoint(nextPoint);
        setFlightDirection(anchorRestingDirection);
        return;
      }

      cancelFlightAnimation();
      startFlying(durationMs);

      if (Math.abs(nextPoint.x - startPoint.x) > 6) {
        setFlightDirection(nextPoint.x > startPoint.x ? 1 : -1);
      }

      const distance = Math.hypot(nextPoint.x - startPoint.x, nextPoint.y - startPoint.y);
      const direction = nextPoint.x >= startPoint.x ? 1 : -1;
      const lift = Math.min(72, Math.max(22, distance * 0.2));
      const glide = Math.min(46, Math.max(16, distance * 0.1));
      const controlA = {
        x: startPoint.x + (nextPoint.x - startPoint.x) * 0.28 + glide * direction,
        y: startPoint.y + (nextPoint.y - startPoint.y) * 0.12 - lift,
      };
      const controlB = {
        x: startPoint.x + (nextPoint.x - startPoint.x) * 0.72 - glide * 0.28 * direction,
        y: startPoint.y + (nextPoint.y - startPoint.y) * 0.78 - lift * 0.42,
      };
      const startedAt = performance.now();

      const animate = (now: number) => {
        const rawProgress = Math.min(1, (now - startedAt) / durationMs);
        const progress = smoothStep(rawProgress);
        const point = cubicBezierPoint(startPoint, controlA, controlB, nextPoint, progress);

        setRenderedPoint(point);

        if (rawProgress < 1) {
          flightFrameRef.current = window.requestAnimationFrame(animate);
          return;
        }

        flightFrameRef.current = null;
        setRenderedPoint(nextPoint);

        window.setTimeout(() => setFlightDirection(anchorRestingDirection), 180);
      };

      flightFrameRef.current = window.requestAnimationFrame(animate);
    },
    [anchorRestingDirection, cancelFlightAnimation, setRenderedPoint, startFlying],
  );

  const refreshAnchor = useCallback(() => {
    const anchor = findAnchor(pathname);

    if (!anchor) {
      return;
    }

    setIsDialogAnchor(isDialogAnchorElement(anchor));
    setAnchorRestingDirection(getAnchorRestingDirection(pathname, anchor));
    const nextPoint = getRenderPoint(pathname, getAnchorPoint(pathname, anchor));
    setAnchorPoint((current) => (hasMeaningfulMovement(current, nextPoint) ? nextPoint : current));
  }, [pathname]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(refreshAnchor);

    const mutationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(refreshAnchor);
    });

    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["class", "data-butterfly-active", "style"],
    });

    const handleViewportChange = () => window.requestAnimationFrame(refreshAnchor);
    const handleScroll = () => {
      if (usesDocumentAnchoredButterfly(pathname) && !isDialogAnchor) {
        return;
      }

      window.requestAnimationFrame(refreshAnchor);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDialogAnchor, pathname, refreshAnchor]);

  useEffect(() => {
    if (!anchorPoint || isDragging) {
      return;
    }

    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      const entryPoint = {
        x: anchorPoint.x - (pathname === "/booking" ? 52 : 36),
        y: anchorPoint.y + 64,
      };

      setRenderedPoint(entryPoint);

      const frameId = window.requestAnimationFrame(() => {
        flyToPoint(anchorPoint, getFlightDurationMs(entryPoint, anchorPoint));
      });

      return () => window.cancelAnimationFrame(frameId);
    }

    const current = renderPointRef.current;

    if (!hasMeaningfulMovement(current, anchorPoint)) {
      return;
    }

    flyToPoint(anchorPoint, getFlightDurationMs(current, anchorPoint));
  }, [anchorPoint, flyToPoint, isDragging, pathname, setRenderedPoint]);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const offset = dragOffsetRef.current;

      if (!offset) {
        return;
      }

      const pointerPoint = getPointerRenderPoint(pathname, event);

      setRenderedPoint({
        x: pointerPoint.x - offset.x,
        y: pointerPoint.y - offset.y,
      });
    };

    const handlePointerUp = () => {
      dragOffsetRef.current = null;
      setIsDragging(false);

      if (anchorPoint) {
        flyToPoint(anchorPoint, getFlightDurationMs(renderPointRef.current, anchorPoint));
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [anchorPoint, flyToPoint, isDragging, pathname, setRenderedPoint]);

  useEffect(() => {
    return () => {
      if (flyTimeoutRef.current) {
        window.clearTimeout(flyTimeoutRef.current);
      }

      cancelFlightAnimation();
    };
  }, [cancelFlightAnimation]);

  const handleGrabStart = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!renderPoint) {
        return;
      }

      const pointerPoint = getPointerRenderPoint(pathname, event);

      dragOffsetRef.current = {
        x: pointerPoint.x - renderPoint.x,
        y: pointerPoint.y - renderPoint.y,
      };

      cancelFlightAnimation();
      setIsDragging(true);
      startFlying();
    },
    [cancelFlightAnimation, pathname, renderPoint, startFlying],
  );

  if (!renderPoint) {
    return null;
  }

  return (
    <BookingStepperButterfly
      isDragging={isDragging}
      isFlying={isFlying}
      isInteractive
      flightDurationMs={flightDurationMs}
      flightDirection={flightDirection}
      isPathControlled
      onGrabStart={handleGrabStart}
      positionMode={usesDocumentAnchoredButterfly(pathname) && !isDialogAnchor ? "absolute" : "fixed"}
      x={renderPoint.x}
      y={renderPoint.y}
    />
  );
}
