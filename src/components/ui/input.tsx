import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md bg-elevated px-3 text-sm text-foreground outline-none shadow-[0_0_0_1px_rgba(255,255,255,0.08)] placeholder:text-subtle focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
