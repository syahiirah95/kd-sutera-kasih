"use client";

import { useState } from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ContextHelpProps = {
  description: string;
  label: string;
  title: string;
  tooltip: string;
};

export function ContextHelp({
  description,
  label,
  title,
  tooltip,
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
            className="rounded-full border border-border/70 bg-white/70 text-muted-foreground"
            aria-label={label}
            onClick={() => setOpen(true)}
          >
            <CircleHelp className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
