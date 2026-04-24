"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactElement,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type OptionElement = ReactElement<{
  children: React.ReactNode;
  value?: string | number;
}>;

type SelectProps = Omit<React.ComponentProps<"select">, "children"> & {
  children: React.ReactNode;
};

function getOptionText(option: OptionElement) {
  const children = option.props.children;

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  return Children.toArray(children).join("");
}

export function Select({
  children,
  className,
  defaultValue,
  disabled,
  id,
  name,
  onChange,
  value,
}: SelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const options = useMemo(
    () =>
      Children.toArray(children)
        .filter(isValidElement)
        .map((option) => {
          const typedOption = option as OptionElement;
          const optionValue = typedOption.props.value ?? getOptionText(typedOption);

          return {
            label: getOptionText(typedOption),
            value: String(optionValue),
          };
        }),
    [children],
  );
  const resolvedValue = String(value ?? defaultValue ?? options[0]?.value ?? "");
  const selectedOption =
    options.find((option) => option.value === resolvedValue) ?? options[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSelect = (nextValue: string) => {
    setIsOpen(false);
    onChange?.({
      target: { name, value: nextValue },
    } as ChangeEvent<HTMLSelectElement>);
  };

  const handleToggle = () => {
    if (!isOpen && rootRef.current) {
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUp(spaceBelow < 220 && spaceAbove > spaceBelow);
    }

    setIsOpen((current) => !current);
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        aria-expanded={isOpen}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] border border-border/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.86)_0%,rgba(255,250,244,0.78)_100%)] pl-4 pr-3 text-left text-[13px] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.74)] outline-none transition hover:border-[#c9a27e]/60 focus:border-primary/50 focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-60",
          className,
        )}
        disabled={disabled}
        id={id}
        onClick={handleToggle}
        type="button"
      >
        <span className="min-w-0 truncate">{selectedOption?.label}</span>
        <ChevronDown className="size-3.5 shrink-0 text-[#5f3f2f]" />
      </button>
      <input name={name} type="hidden" value={selectedOption?.value ?? ""} />
      {isOpen ? (
        <div
          className={cn(
            "absolute z-50 max-h-48 w-full overflow-y-auto rounded-[var(--radius-sm)] border border-[#c9a27e]/55 bg-[#fffaf4] p-1 shadow-[0_14px_30px_rgba(114,76,43,0.16)]",
            openUp ? "bottom-full mb-1" : "mt-1",
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === selectedOption?.value;

            return (
              <button
                className={cn(
                  "block w-full rounded-[calc(var(--radius-sm)-0.25rem)] px-3 py-1.5 text-left text-[13px] leading-5 text-[#34261d] transition hover:bg-[linear-gradient(135deg,rgba(255,242,222,0.95)_0%,rgba(246,226,207,0.9)_100%)] hover:text-[#8d542d]",
                  isSelected &&
                    "bg-[linear-gradient(135deg,#dca453_0%,#bf762f_52%,#f0c46c_100%)] font-semibold text-white shadow-[0_6px_16px_rgba(184,111,41,0.2)] hover:text-white",
                )}
                key={option.value}
                onClick={() => handleSelect(option.value)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
