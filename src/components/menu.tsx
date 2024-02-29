import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UrlObject } from "url";
import RouteImpl from "next/types/index.js";

type RouteImpl = any

const Menu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-80 flex flex-col", className)} {...props} />
));

Menu.displayName = "Menu";

const MenuHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex pb-2 justify-between items-center", className)}
    {...props}
  />
));
MenuHeader.displayName = "MenuHeader";

const MenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col flex-1 overflow-y-auto gap-1 py-2",
      className
    )}
    {...props}
  />
));
MenuContent.displayName = "MenuContent";

interface MenuItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: UrlObject | RouteImpl;
  isSelected?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ href, isSelected, children, className, ...props }) => {
  return (
    <Link
      href={href}
      className={cn(
        className,
        "items-center text-sm font-medium rounded-md flex gap-2 p-2 hover:bg-altBackgroundShade hover:border-altButtonHover border-separate border-2 border-transparent transition-colors",
        isSelected ? "bg-altBackgroundShade border-altBorder" : "",
        
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

const MenuFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
));
MenuFooter.displayName = "MenuFooter";

export { Menu, MenuContent, MenuFooter, MenuHeader, MenuItem };
