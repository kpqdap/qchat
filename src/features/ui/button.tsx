import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-button text-buttonText hover:bg-buttonHover",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-button hover:text-buttonText",
        link: "text-primary underline-offset-4 hover:underline",
        code: "absolute right-2 top-2 h-7 p-1 text-sm font-white focus:bg-accent focus:text-link",
        copyCode: "absolute right-2 top-2 h-7 p-1 text-sm text-white focus:bg-accent focus:text-link",
        menuRound: "rounded-full w-10 h-10 p-1 text-primary border border-input hover:bg-accent",
        dropdownTrigger:
          "flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm font-medium text-left text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-7 w-7 rounded",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const ButtonLinkVariant = cn(
  buttonVariants({ variant: "ghost" }),
  "p-0 w-full h-12 w-12 flex items-center justify-center "
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ariaLabel?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ariaLabel, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        aria-label={ariaLabel || props.children?.toString()}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, ButtonLinkVariant, buttonVariants }
