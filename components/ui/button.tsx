import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      size: {
        default: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        xl: "h-14 px-7 text-sm",
        icon: "size-10",
      },
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_16px_40px_rgba(212,155,106,0.35)] hover:brightness-[1.03]",
        secondary:
          "border border-border/70 bg-white/70 text-foreground hover:bg-white/85",
        ghost: "bg-transparent hover:bg-white/60",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asLink?: false;
    href?: never;
  };

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants> & {
    asLink: true;
  };

export function Button(props: ButtonProps | ButtonLinkProps) {
  const { className, size, variant } = props;

  if ("asLink" in props && props.asLink) {
    const { asLink, href, ...linkProps } = props;
    void asLink;
    return (
      <Link
        className={cn(buttonVariants({ size, variant }), className)}
        href={href}
        {...linkProps}
      />
    );
  }

  const { asLink: _asLink, ...buttonProps } = props as ButtonProps & {
    asLink?: false;
  };
  void _asLink;

  return (
    <button
      className={cn(buttonVariants({ size, variant }), className)}
      {...buttonProps}
    />
  );
}
