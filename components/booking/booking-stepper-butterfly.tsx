"use client";

import type { CSSProperties, PointerEventHandler } from "react";
import { Suspense, useEffect, useId, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Box3, Group, MathUtils, Vector3 } from "three";
import { getPlannerModelAssetUrl } from "@/lib/constants/planner-assets";
import { cn } from "@/lib/utils";

type BookingStepperButterflyProps = {
  flightDurationMs?: number;
  flightDirection?: -1 | 1;
  isDragging?: boolean;
  isFlying: boolean;
  isInteractive?: boolean;
  isPathControlled?: boolean;
  onGrabStart?: PointerEventHandler<HTMLButtonElement>;
  positionMode?: "absolute" | "fixed";
  x: number;
  y: number;
};

const MAGIC_TRAIL_PATH =
  "M164 55C148 57 132 61 116 65C99 69 84 74 70 81";
const MAGIC_TRAIL_PATH_FACING_LEFT =
  "M4 55C20 57 36 61 52 65C69 69 84 74 98 81";

const FLOWING_STARS = [
  { delay: "-0.1s", duration: "4.8s", opacity: 0.98, scale: 4.2 },
  { delay: "-0.78s", duration: "5.2s", opacity: 0.86, scale: 3.4 },
  { delay: "-1.44s", duration: "4.95s", opacity: 0.94, scale: 4 },
  { delay: "-2.12s", duration: "5.45s", opacity: 0.78, scale: 3.2 },
  { delay: "-2.78s", duration: "5.1s", opacity: 0.88, scale: 3.8 },
  { delay: "-3.48s", duration: "5.55s", opacity: 0.74, scale: 3.5 },
] as const;

const BUTTERFLY_MODEL_URL = getPlannerModelAssetUrl("animated_butterfly.glb");

function ButterflyModel({
  flightDirection = 1,
  isDragging,
  isFlying,
}: Readonly<Pick<BookingStepperButterflyProps, "flightDirection" | "isDragging" | "isFlying">>) {
  const groupRef = useRef<Group | null>(null);
  const { animations, scene } = useGLTF(BUTTERFLY_MODEL_URL);
  const { actions } = useAnimations(animations, groupRef);

  const { center, scale } = useMemo(() => {
    const clonedScene = scene.clone();
    const box = new Box3().setFromObject(clonedScene);
    const size = new Vector3();
    const nextCenter = new Vector3();

    box.getSize(size);
    box.getCenter(nextCenter);

    return {
      center: nextCenter,
      scale: 1.02 / Math.max(size.x, size.y, size.z, 0.001),
    };
  }, [scene]);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (!action) {
        return;
      }

      action.reset();
      action.fadeIn(0.28);
      action.play();
      action.timeScale = isDragging ? 1.65 : isFlying ? 1.35 : 1;
    });

    return () => {
      Object.values(actions).forEach((action) => action?.fadeOut(0.2));
    };
  }, [actions, isDragging, isFlying]);

  useFrame(({ clock }) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    const verticalFlutter = Math.sin(elapsed * 2.5) * 0.08 + Math.cos(elapsed * 5.2) * 0.026;
    const lateralFlutter = Math.cos(elapsed * 1.45) * 0.042 + Math.sin(elapsed * 3.4) * 0.016;
    const wingPulse = Math.sin(elapsed * (isFlying ? 5.8 : 4.4));

    group.position.y = verticalFlutter + (isDragging ? 0.03 : 0);
    group.position.x = lateralFlutter;
    group.rotation.z =
      (Math.sin(elapsed * 1.7) * 0.12 + Math.cos(elapsed * 3.3) * 0.05 + (isDragging ? 0.08 : 0)) *
      flightDirection;
    group.rotation.y = MathUtils.lerp(
      group.rotation.y,
      flightDirection * (Math.PI / 2) + Math.sin(elapsed * 0.95) * 0.16 + Math.cos(elapsed * 2.2) * 0.06,
      0.08,
    );
    group.rotation.x = -0.08 + wingPulse * 0.05 + Math.cos(elapsed * 1.8) * 0.03 + (isFlying ? -0.05 : 0);
  });

  return (
    <group ref={groupRef} scale={isFlying ? scale * 1.04 : scale}>
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  );
}

export function BookingStepperButterfly({
  flightDurationMs = 1800,
  flightDirection = 1,
  isDragging = false,
  isFlying,
  isInteractive = false,
  isPathControlled = false,
  onGrabStart,
  positionMode = "absolute",
  x,
  y,
}: Readonly<BookingStepperButterflyProps>) {
  const trailId = useId().replaceAll(":", "");
  const trailPathId = `${trailId}-magic-star-trail`;
  const trailPath = flightDirection < 0 ? MAGIC_TRAIL_PATH_FACING_LEFT : MAGIC_TRAIL_PATH;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none left-0 top-0 transition-transform",
        positionMode === "fixed" ? "block" : "hidden lg:block",
        positionMode === "fixed" ? "z-[260]" : "z-30",
        positionMode === "fixed" ? "fixed" : "absolute",
      )}
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transitionDuration: isDragging || isPathControlled ? "0ms" : `${isFlying ? flightDurationMs : 650}ms`,
        transitionTimingFunction: isFlying ? "cubic-bezier(0.45, 0, 0.25, 1)" : "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <button
        type="button"
        onPointerDown={onGrabStart}
        className={cn(
          "booking-butterfly relative block -translate-x-1/2 -translate-y-1/2 rounded-full bg-transparent p-0",
          isInteractive ? "pointer-events-auto touch-none cursor-grab active:cursor-grabbing" : "pointer-events-none",
          isFlying && "booking-butterfly-flight",
          isDragging && "booking-butterfly-dragging",
          flightDirection < 0 && "booking-butterfly-facing-left",
        )}
      >
        <div
          className={cn(
            "booking-butterfly-trail absolute left-1/2 top-1/2 h-[112px] w-[168px] -translate-y-[52%]",
            flightDirection < 0 ? "translate-x-[4%]" : "-translate-x-[96%]",
          )}
        >
          <svg
            className="booking-butterfly-trail-svg absolute inset-0 h-full w-full overflow-visible"
            fill="none"
            viewBox="0 0 168 112"
          >
            <defs>
              <path id={trailPathId} d={trailPath} />
            </defs>

            {FLOWING_STARS.map((star) => (
              <g
                key={`${star.delay}-${star.duration}-${star.scale}`}
                className="booking-butterfly-trail-star"
                style={
                  {
                    animationDelay: star.delay,
                    animationDuration: star.duration,
                  } as CSSProperties
                }
              >
                <path
                  d={`M0 ${-star.scale} C ${star.scale * 0.5} ${-star.scale * 0.54} ${star.scale * 0.66} ${-star.scale * 0.2} ${star.scale} 0 C ${star.scale * 0.66} ${star.scale * 0.2} ${star.scale * 0.5} ${star.scale * 0.54} 0 ${star.scale} C ${-star.scale * 0.5} ${star.scale * 0.54} ${-star.scale * 0.66} ${star.scale * 0.2} ${-star.scale} 0 C ${-star.scale * 0.66} ${-star.scale * 0.2} ${-star.scale * 0.5} ${-star.scale * 0.54} 0 ${-star.scale} Z`}
                  fill="rgba(255, 215, 111, 0.96)"
                />
                <animate
                  attributeName="opacity"
                  dur={star.duration}
                  keyTimes="0;0.14;0.56;1"
                  repeatCount="indefinite"
                  values={`0;${star.opacity};${star.opacity * 0.34};0`}
                />
                <animateMotion
                  begin={star.delay}
                  calcMode="spline"
                  dur={star.duration}
                  keySplines="0.42 0 0.58 1"
                  keyPoints="0;1"
                  keyTimes="0;1"
                  repeatCount="indefinite"
                  rotate="auto"
                >
                  <mpath href={`#${trailPathId}`} />
                </animateMotion>
              </g>
            ))}
          </svg>
        </div>

        <div className="relative size-[62px]">
          <Canvas
            camera={{ fov: 24, position: [0, 0.22, 6.8] }}
            className="pointer-events-none !size-full overflow-visible"
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={1.8} />
            <directionalLight intensity={2.3} position={[4, 5, 5]} />
            <directionalLight intensity={1.2} position={[-4, 2, 3]} />
            <Suspense fallback={null}>
              <ButterflyModel flightDirection={flightDirection} isDragging={isDragging} isFlying={isFlying} />
            </Suspense>
          </Canvas>
        </div>
      </button>
    </div>
  );
}

useGLTF.preload(BUTTERFLY_MODEL_URL);
