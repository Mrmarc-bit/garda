"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenu");
  }
  return context;
}

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div ref={menuRef} className="relative inline-block w-full text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLElement> {
  render?: React.ReactElement<Record<string, unknown>>;
  asChild?: boolean;
}

/** Props this component reads off a cloned trigger element. */
interface ClonedTriggerProps {
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  ref?: React.Ref<HTMLElement>;
  "aria-expanded"?: React.AriaAttributes["aria-expanded"];
  "data-state"?: string;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLElement, DropdownMenuTriggerProps>(
  ({ children, render, asChild, className, onClick, ...props }, ref) => {
    const { open, setOpen } = useDropdownMenu();
    const renderProps = (render?.props ?? {}) as ClonedTriggerProps;

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      setOpen((prev) => !prev);
      if (onClick) onClick(e);
      if (typeof renderProps.onClick === "function") {
        renderProps.onClick(e);
      }
    };

    if (render && React.isValidElement(render)) {
      return React.cloneElement(render, {
        ref,
        "aria-expanded": open,
        "data-state": open ? "open" : "closed",
        onClick: handleClick,
        className: cn(renderProps.className, className),
        children: children ?? renderProps.children,
        ...props,
      });
    }

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<ClonedTriggerProps>;
      return React.cloneElement(child, {
        ref,
        "aria-expanded": open,
        "data-state": open ? "open" : "closed",
        onClick: handleClick,
        className: cn(child.props.className, className),
        ...props,
      });
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onClick={handleClick}
        className={cn("w-full cursor-pointer focus:outline-none", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, side = "bottom", align = "start", children, ...props }, ref) => {
    const { open } = useDropdownMenu();

    if (!open) return null;

    let positionClasses = "top-full mt-1.5";
    if (side === "right") {
      positionClasses = "left-full top-0 ml-2";
    } else if (side === "left") {
      positionClasses = "right-full top-0 mr-2";
    } else if (side === "top") {
      positionClasses = "bottom-full mb-1.5";
    }

    let alignClasses = "left-0";
    if (align === "end") {
      alignClasses = side === "bottom" || side === "top" ? "right-0" : "bottom-0";
    } else if (align === "center") {
      alignClasses = "left-1/2 -translate-x-1/2";
    }

    return (
      <div
        ref={ref}
        role="menu"
        className={cn(
          "absolute z-50 min-w-[14rem] overflow-hidden rounded-xl border border-[#383838] bg-[#1E1E1E] p-1.5 text-xs text-[#F5F5F5] shadow-2xl animate-in fade-in-0 zoom-in-95",
          positionClasses,
          alignClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export function DropdownMenuGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-0.5", className)} {...props} />;
}

export function DropdownMenuLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-[#737373] uppercase", className)}
      {...props}
    />
  );
}

export function DropdownMenuItem({
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { setOpen } = useDropdownMenu();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setOpen(false);
    if (onClick) onClick(e);
  };

  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={handleClick}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-[#F5F5F5] outline-none transition-colors hover:bg-[#2C2C2C] hover:text-white focus:bg-[#2C2C2C] focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-[#303030]", className)}
      {...props}
    />
  );
}

export function DropdownMenuShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-[10px] tracking-widest text-[#737373]", className)}
      {...props}
    />
  );
}
