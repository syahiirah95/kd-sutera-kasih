"use client";

import { useState } from "react";
import {
  Check,
  Edit3,
  Mail,
  Phone,
  UserRound,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { createSupabaseBrowserClient } from "@/lib/auth/client";
import type { AuthUser } from "@/lib/types/auth";

function HoverTooltipIconButton({
  ariaLabel,
  children,
  className,
  disabled,
  onClick,
  tooltip,
}: Readonly<{
  ariaLabel: string;
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
  onClick: () => void;
  tooltip: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open}>
      <TooltipTrigger asChild>
        <button
          aria-label={ariaLabel}
          className={className}
          disabled={disabled}
          onBlur={() => setOpen(false)}
          onClick={onClick}
          onFocus={() => setOpen(false)}
          onPointerEnter={() => setOpen(true)}
          onPointerLeave={() => setOpen(false)}
          type="button"
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function EditIconButton({
  label,
  onClick,
}: Readonly<{
  label: string;
  onClick: () => void;
}>) {
  return (
    <HoverTooltipIconButton
      ariaLabel={label}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-border/70 bg-white/70 text-muted-foreground transition hover:border-[#c9a27e]/55 hover:bg-white hover:text-[#8d542d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={onClick}
      tooltip={label}
    >
      <Edit3 className="size-3.5" />
    </HoverTooltipIconButton>
  );
}

function InlineSaveActions({
  disabled,
  onCancel,
  onSave,
}: Readonly<{
  disabled?: boolean;
  onCancel: () => void;
  onSave: () => void;
}>) {
  return (
    <div className="flex gap-1.5">
      <HoverTooltipIconButton
        ariaLabel="Save changes"
        className="inline-flex size-7 items-center justify-center rounded-full border border-[#c8893e]/55 bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] text-white shadow-[0_6px_16px_rgba(184,111,41,0.22)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        disabled={disabled}
        onClick={onSave}
        tooltip="Save changes"
      >
        <Check className="size-3.5" />
      </HoverTooltipIconButton>
      <HoverTooltipIconButton
        ariaLabel="Cancel edit"
        className="inline-flex size-7 items-center justify-center rounded-full border border-border/70 bg-white/70 text-muted-foreground transition hover:bg-white hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        disabled={disabled}
        onClick={onCancel}
        tooltip="Cancel edit"
      >
        <X className="size-3.5" />
      </HoverTooltipIconButton>
    </div>
  );
}

export function AccountInfoDialog({
  onOpenChange,
  open,
  user,
}: Readonly<{
  onOpenChange: (open: boolean) => void;
  open: boolean;
  user: AuthUser;
}>) {
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user.displayName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ?? "");
  const [draftDisplayName, setDraftDisplayName] = useState(user.displayName);
  const [draftPhoneNumber, setDraftPhoneNumber] = useState(user.phoneNumber ?? "");
  const [editingField, setEditingField] = useState<"name" | "phone" | null>(null);
  const [savingField, setSavingField] = useState<"name" | "phone" | null>(null);

  const startEditingName = () => {
    setDraftDisplayName(displayName);
    setEditingField("name");
  };

  const startEditingPhone = () => {
    setDraftPhoneNumber(phoneNumber);
    setEditingField("phone");
  };

  const saveName = async () => {
    const nextName = draftDisplayName.trim() || displayName;
    const supabase = createSupabaseBrowserClient();

    setSavingField("name");

    if (supabase) {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: nextName,
          name: nextName,
        },
      });

      if (error) {
        setSavingField(null);
        toast({
          message: "We couldn't update your full name just yet. Rude, honestly. Please try again.",
          title: "Oh no",
          variant: "error",
        });
        return;
      }
    }

    setDisplayName(nextName);
    setEditingField(null);
    setSavingField(null);
    toast({
      message: "Lovely. Your full name is looking very correct now.",
      title: "Looking good",
      variant: "success",
    });
  };

  const savePhone = async () => {
    const nextPhoneNumber = draftPhoneNumber.trim();
    const supabase = createSupabaseBrowserClient();

    setSavingField("phone");

    if (supabase) {
      const { error } = await supabase.auth.updateUser({
        data: {
          phone: nextPhoneNumber,
          phoneNumber: nextPhoneNumber,
          phone_number: nextPhoneNumber,
        },
      });

      if (error) {
        setSavingField(null);
        toast({
          message: "We couldn't update your phone number just yet. Deeply inconvenient. Please try again.",
          title: "Oh no",
          variant: "error",
        });
        return;
      }
    }

    setPhoneNumber(nextPhoneNumber);
    setEditingField(null);
    setSavingField(null);
    toast({
      message: "Done. Your phone number is now nicely in place.",
      title: "Looking good",
      variant: "success",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(92vw,26rem)] rounded-[var(--radius-sm)]">
        <DialogHeader className="pr-0 text-center">
          <DialogTitle className="text-center">
            <span className="inline-flex items-center" data-butterfly-anchor="account-info-title">
              Account Info
            </span>
          </DialogTitle>
          <DialogDescription className="mx-auto max-w-[20rem] text-center">
            Review your basic profile details and update the information linked to your bookings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm leading-6 text-muted-foreground">
          <div className="pt-5">
            <div className="relative h-px overflow-visible">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(212,155,106,0)_0%,rgba(212,155,106,0.4)_18%,rgba(212,155,106,0.75)_50%,rgba(212,155,106,0.4)_82%,rgba(212,155,106,0)_100%)]" />
              <div className="absolute left-1/2 top-1/2 h-4 w-28 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(240,196,108,0.26)_0%,rgba(240,196,108,0)_72%)] blur-md" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <UserRound className="mt-1 size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">Full Name</p>
                {editingField === "name" ? (
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      className="h-9 rounded-[var(--radius-sm)] bg-white/80 px-3"
                      disabled={savingField === "name"}
                      value={draftDisplayName}
                      onChange={(event) => setDraftDisplayName(event.target.value)}
                    />
                    <InlineSaveActions
                      disabled={savingField === "name"}
                      onCancel={() => setEditingField(null)}
                      onSave={saveName}
                    />
                  </div>
                ) : (
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="min-w-0 flex-1 break-words">{displayName}</p>
                    <EditIconButton label="Edit full name" onClick={startEditingName} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="mt-1 size-4 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="font-semibold text-foreground">Email</p>
                <p className="break-words">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-1 size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">Phone Number</p>
                {editingField === "phone" ? (
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      className="h-9 rounded-[var(--radius-sm)] bg-white/80 px-3"
                      disabled={savingField === "phone"}
                      placeholder="+60 12-345 6789"
                      value={draftPhoneNumber}
                      onChange={(event) => setDraftPhoneNumber(event.target.value)}
                    />
                    <InlineSaveActions
                      disabled={savingField === "phone"}
                      onCancel={() => setEditingField(null)}
                      onSave={savePhone}
                    />
                  </div>
                ) : (
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className="min-w-0 flex-1 break-words">{phoneNumber || "Not added yet"}</p>
                    <EditIconButton label="Edit phone number" onClick={startEditingPhone} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
