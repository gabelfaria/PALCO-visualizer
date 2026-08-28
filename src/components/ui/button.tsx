import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none select-none transition-[scale,background-color,color,opacity,box-shadow] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-elevated text-foreground hover:bg-elevated/80 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]",
        ghost: "text-muted hover:text-foreground hover:bg-elevated",
        outline:
          "bg-transparent text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.10)] hover:bg-elevated",
        record: "bg-record text-foreground hover:bg-record/90",
        danger: "text-record hover:bg-record/15",
      },
      size: {
        default: "h-10 px-3.5",
        sm: "h-8 px-2.5 text-xs rounded-sm",
        lg: "h-11 px-5",
        icon: "size-10",
        "icon-sm": "size-8 rounded-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
