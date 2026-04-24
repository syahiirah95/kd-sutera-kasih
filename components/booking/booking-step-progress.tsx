"use client";

import { Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type BookingStepProgressProps = {
  completedSteps?: ReadonlyArray<boolean>;
  currentStep: number;
  onSelect: (step: number) => void;
  selectableSteps?: ReadonlyArray<boolean>;
  steps: ReadonlyArray<{
    description: string;
    number: string;
    title: string;
  }>;
};

export function BookingStepProgress({
  completedSteps,
  currentStep,
  onSelect,
  selectableSteps,
  steps,
}: BookingStepProgressProps) {
  return (
    <div className="overflow-x-auto overflow-y-visible py-1 lg:overflow-visible lg:py-3">
      <div className="relative mx-auto flex min-w-[780px] items-start justify-between gap-3 lg:w-[82%] lg:min-w-0 lg:gap-4">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = completedSteps?.[index] ?? currentStep > index;
          const isSelectable = selectableSteps?.[index] ?? index <= currentStep;
          const stepButton = (
            <button
              type="button"
              disabled={!isSelectable}
              onClick={() => onSelect(index)}
              className={cn(
                "flex min-w-[72px] flex-col items-center gap-2 text-center",
                !isSelectable && !isCompleted ? "disabled:cursor-not-allowed" : "disabled:cursor-default",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-sm font-semibold transition lg:size-9",
                  isCompleted
                    ? "booking-step-progress-completed border-[#c8893e]/55 bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] text-white shadow-[0_8px_20px_rgba(184,111,41,0.28)]"
                    : isActive
                      ? "border-primary bg-white text-primary"
                      : "border-border/70 bg-white text-muted-foreground",
                )}
              >
                {isCompleted ? <Check className="size-4" /> : step.number}
              </span>
              <span
                data-butterfly-step-label=""
                data-butterfly-active={isActive ? "true" : undefined}
                className={cn(
                  "text-[11px] transition lg:text-xs",
                  isActive || isCompleted ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                {step.title}
              </span>
            </button>
          );

          return (
            <div key={step.number} className="flex min-w-0 flex-1 items-start gap-3">
              {isSelectable || isCompleted ? (
                stepButton
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="inline-flex cursor-not-allowed"
                      tabIndex={0}
                    >
                      {stepButton}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    Complete the previous step before opening {step.title}.
                  </TooltipContent>
                </Tooltip>
              )}
              {index < steps.length - 1 ? (
                <div className="mt-4 h-px flex-1 bg-border/70" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
