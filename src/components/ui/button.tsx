import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-border bg-transparent hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-lg hover:shadow-secondary/25",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        cyan: "bg-gradient-cyan text-background font-bold hover:shadow-lg hover:shadow-cyan/30 hover:scale-[1.02] active:scale-[0.98]",
        magenta: "bg-gradient-magenta text-foreground font-bold hover:shadow-lg hover:shadow-magenta/30 hover:scale-[1.02] active:scale-[0.98]",
        purple: "bg-gradient-purple text-foreground font-bold hover:shadow-lg hover:shadow-purple/30 hover:scale-[1.02] active:scale-[0.98]",
        orange: "bg-gradient-orange text-foreground font-bold hover:shadow-lg hover:shadow-orange/30 hover:scale-[1.02] active:scale-[0.98]",
        glass: "glass-card border-border/50 text-foreground hover:bg-card/60 hover:border-primary/50",
        hero: "bg-gradient-to-r from-primary via-cyan to-teal text-background font-bold text-base px-8 py-6 rounded-xl hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
