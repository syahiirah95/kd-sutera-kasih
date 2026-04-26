"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ContextHelpProps = {
  children?: React.ReactNode;
  contentClassName?: string;
  description: string;
  label: string;
  title: string;
  tooltip: string;
  triggerClassName?: string;
};

export function ContextHelp({
  children,
  contentClassName,
  description,
  label,
  title,
  tooltip,
  triggerClassName,
}: ContextHelpProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={`rounded-full border border-border/70 bg-white/70 text-muted-foreground ${triggerClassName ?? ""}`}
            aria-label={label}
            onClick={() => setOpen(true)}
          >
            <CircleHelp className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={contentClassName}>
          <DialogHeader className="pr-0">
            <DialogTitle className="pr-10">{title}</DialogTitle>
            <DialogDescription className="text-justify">{description}</DialogDescription>
          </DialogHeader>
          {children ? <div>{children}</div> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
