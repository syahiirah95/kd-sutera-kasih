"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { type VenueMediaRecord } from "@/lib/data/venues";

export function HeroTestimonyCarousel({
  venueName,
  videos,
}: Readonly<{
  venueName: string;
  videos: VenueMediaRecord[];
}>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = useMemo(
    () => (videos.length ? activeIndex % videos.length : 0),
    [activeIndex, videos.length],
  );
  const activeVideo = videos[safeActiveIndex];

  if (!videos.length) {
    return (
      <div className="overflow-hidden rounded-[1.1rem] border-[3px] border-[#ead2b3]/90 bg-white/20 shadow-[0_18px_42px_rgba(114,76,43,0.16)] backdrop-blur-md">
        <div className="rounded-[0.85rem] bg-[rgba(255,251,246,0.52)] px-4 py-8 text-center text-sm leading-7 text-[#6f5648]">
          Testimony video untuk {venueName} belum dimuat naik lagi.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[29rem] flex-col items-center gap-3 lg:max-w-none">
      <div className="relative w-full overflow-hidden rounded-[1.1rem] border-[3px] border-[#ead2b3]/90 bg-[#2b1d16]/86 shadow-[0_18px_42px_rgba(35,23,18,0.24)]">
        <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/52 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/78 backdrop-blur">
          {safeActiveIndex + 1} / {videos.length}
        </span>
        <video
          key={activeVideo.src}
          autoPlay
          className="aspect-[4/5] w-full object-cover md:aspect-[16/11] lg:aspect-[4/5]"
          controls
          muted
          onEnded={() => setActiveIndex((currentIndex) => (currentIndex + 1) % videos.length)}
          playsInline
          preload="metadata"
          src={activeVideo.src}
        />
      </div>

      <div className="flex items-center gap-2 rounded-full border border-white/25 bg-black/60 px-3 py-2 shadow-[0_10px_24px_rgba(35,23,18,0.18)] backdrop-blur">
        {videos.map((video, index) => {
          const isActive = index === safeActiveIndex;

          return (
            <button
              key={`${video.src}-${index}`}
              aria-label={`Show testimony video ${index + 1}`}
              className={cn(
                "size-2 rounded-full bg-white/46 transition hover:bg-white/80",
                isActive &&
                  "bg-[linear-gradient(135deg,#dca453_0%,#bf762f_58%,#f0c46c_100%)] shadow-[0_0_10px_rgba(220,164,83,0.46)]",
              )}
              type="button"
              onClick={() => setActiveIndex(index)}
            >
              <span className="sr-only">
                {video.alt || `Testimony video ${index + 1}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
