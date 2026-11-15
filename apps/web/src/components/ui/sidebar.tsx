"use client";

import * as React from "react";
import { PanelLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
  state: "expanded" | "collapsed";
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        setInternalOpen(openState);
      }
    },
    [setOpenProp, open]
  );

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "b") {
        event.preventDefault();
        toggleSidebar();
        return;
      }
      // Escape closes the mobile drawer so a keyboard user is never trapped
      // behind an off-canvas panel.
      if (event.key === "Escape" && openMobile) {
        setOpenMobile(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, openMobile, setOpenMobile]);

  const state = open ? "expanded" : "collapsed";

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
        state,
      }}
    >
      <div
        className={cn(
          "group/sidebar-wrapper flex min-h-svh w-full text-sidebar-foreground",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"aside"> & {
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(({ variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
  const { open, openMobile, setOpenMobile, isMobile } = useSidebar();

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {openMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setOpenMobile(false)}
        />
      )}

      {/* Main Sidebar Box */}
      <aside
        ref={ref}
        data-state={open ? "expanded" : "collapsed"}
        data-collapsible={collapsible}
        // Off-canvas below lg: the drawer must be OUT of the flex flow, otherwise
        // it keeps consuming 256px and squeezes <main> to ~119px on a 375px
        // viewport. A transform alone only hides it visually.
        inert={isMobile && !openMobile ? true : undefined}
        aria-hidden={isMobile && !openMobile ? true : undefined}
        aria-label="Workspace navigation"
        className={cn(
          "group/sidebar flex flex-col justify-between shrink-0 select-none",
          "transition-[transform,width] duration-200 ease-in-out",
          // Mobile: fixed overlay drawer, full height, slides in from the left.
          "fixed inset-y-0 left-0 z-50 w-72 shadow-2xl",
          openMobile ? "translate-x-0" : "-translate-x-full",
          // Desktop: static column back in the flex row; width follows collapse state.
          "lg:static lg:z-40 lg:shadow-none lg:translate-x-0",
          open ? "lg:w-64" : "lg:w-[60px]",
          variant === "inset" ? "bg-transparent border-none" : "bg-sidebar border-r border-sidebar-border",
          className
        )}
        {...props}
      >
        {children}
      </aside>
    </>
  );
});
Sidebar.displayName = "Sidebar";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-2 group-data-[state=collapsed]/sidebar:items-center", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden p-2",
      className
    )}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-2 group-data-[state=collapsed]/sidebar:items-center", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

export const SidebarSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-px w-full bg-sidebar-border/60 my-1", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex w-full min-w-0 flex-col p-1.5", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-7 shrink-0 items-center px-2 text-[11px] font-semibold tracking-wider text-[#737373] uppercase outline-none group-data-[state=collapsed]/sidebar:hidden",
      className
    )}
    {...props}
  />
));
SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-sidebar="group-action"
    className={cn(
      "absolute right-2 top-2 flex size-5 items-center justify-center rounded-md text-[#737373] hover:bg-sidebar-accent hover:text-white transition-colors cursor-pointer group-data-[state=collapsed]/sidebar:hidden",
      className
    )}
    {...props}
  />
));
SidebarGroupAction.displayName = "SidebarGroupAction";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full text-xs space-y-0.5", className)} {...props} />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn(
      "group/menu-item relative flex items-center w-full list-none group-data-[state=collapsed]/sidebar:justify-center",
      className
    )}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  size?: "default" | "sm" | "lg";
  render?: React.ReactElement<Record<string, unknown>>;
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, isActive, size = "default", render, children, ...props }, ref) => {
  const sizeClasses =
    size === "sm"
      ? "h-8 text-xs px-2.5 gap-2 pr-8 group-data-[state=collapsed]/sidebar:size-9 group-data-[state=collapsed]/sidebar:p-0 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:pr-0"
      : size === "lg"
      ? "h-12 text-sm px-3 gap-3 pr-8 group-data-[state=collapsed]/sidebar:size-10 group-data-[state=collapsed]/sidebar:p-0 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:pr-0"
      : "h-9 text-xs px-2.5 gap-2.5 pr-8 group-data-[state=collapsed]/sidebar:size-9 group-data-[state=collapsed]/sidebar:p-0 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:mx-auto group-data-[state=collapsed]/sidebar:pr-0";

  const baseClasses = cn(
    "flex w-full items-center rounded-lg font-medium transition-colors outline-none cursor-pointer select-none",
    sizeClasses,
    isActive
      ? "bg-[#252525] text-white font-semibold shadow-xs"
      : "text-[#A3A3A3] hover:bg-[#202020] hover:text-[#F5F5F5]",
    className
  );

  if (render && React.isValidElement(render)) {
    // Narrow the cloned element's props once, instead of casting at each use site.
    const renderProps = render.props as { className?: string; children?: React.ReactNode };
    return React.cloneElement(render, {
      ref,
      "data-active": isActive ? "true" : undefined,
      className: cn(baseClasses, renderProps.className),
      children: children ?? renderProps.children,
      ...props,
    });
  }

  return (
    <button
      ref={ref}
      type="button"
      data-active={isActive ? "true" : undefined}
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 min-w-5 select-none items-center justify-center rounded-full px-1.5 text-[10px] font-mono font-bold tabular-nums bg-[#262626] text-[#FF6B35] border border-[#3A3A3A] shadow-xs group-data-[state=collapsed]/sidebar:hidden",
      className
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

export const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    showOnHover?: boolean;
  }
>(({ className, showOnHover, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-sidebar="menu-action"
    className={cn(
      "absolute right-2 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-md text-[#737373] hover:bg-[#2A2A2A] hover:text-[#F5F5F5] transition-opacity cursor-pointer group-data-[state=collapsed]/sidebar:hidden",
      showOnHover && "opacity-0 group-hover/menu-item:opacity-100",
      className
    )}
    {...props}
  />
));
SidebarMenuAction.displayName = "SidebarMenuAction";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle Sidebar"
      title="Toggle Sidebar (⌘B)"
      onClick={(e) => {
        toggleSidebar();
        onClick?.(e);
      }}
      className={cn(
        "flex size-7 items-center justify-center rounded-lg border border-[#383838] bg-[#202020] text-[#A3A3A3] hover:bg-[#2C2C2C] hover:text-white transition-colors cursor-pointer",
        className
      )}
      {...props}
    >
      <PanelLeft className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    className={cn(
      "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#171717]",
      "lg:m-2 lg:ml-0 lg:rounded-xl lg:border lg:border-[#282828] lg:shadow-xl",
      className
    )}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";
