"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import {
  AlertCircleIcon,
  ArchiveIcon,
  BarChart3Icon,
  BellIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  CircleCheckIcon,
  CopyIcon,
  FileTextIcon,
  FolderIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  PlusIcon,
  RocketIcon,
  SettingsIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react";

interface Workspace {
  id: string;
  name: string;
  plan: string;
  initials: string;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const WORKSPACES: Workspace[] = [
  {
    id: "sim-lab",
    name: "Simulation Lab",
    plan: "Defensive Twin",
    initials: "SL",
  },
  {
    id: "scada-substation",
    name: "Industrial SCADA Lab",
    plan: "OT Modbus Safe",
    initials: "OT",
  },
  {
    id: "soc-vault",
    name: "Air-Gapped SOC Vault",
    plan: "HMAC-SHA256 Ledger",
    initials: "SR",
  },
];

const MAIN_NAV: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    href: "/app",
    icon: <LayoutDashboardIcon className="size-4 shrink-0" aria-hidden="true" />,
  },
  {
    id: "incidents",
    label: "Incidents",
    href: "/app/incidents",
    badge: 2,
    icon: <AlertCircleIcon className="size-4 shrink-0 text-red-400" aria-hidden="true" />,
  },
  {
    id: "evidence",
    label: "Evidence & Timeline",
    href: "/app/evidence",
    badge: 4,
    icon: <FileTextIcon className="size-4 shrink-0" aria-hidden="true" />,
  },
  {
    id: "simulator",
    label: "Response Simulator",
    href: "/app/simulator",
    icon: <RocketIcon className="size-4 shrink-0 text-[#FF6B35]" aria-hidden="true" />,
  },
  {
    id: "digital-twin",
    label: "IT/OT Digital Twin",
    href: "/app/digital-twin",
    icon: <LayersIcon className="size-4 shrink-0" aria-hidden="true" />,
  },
  {
    id: "recommendations",
    label: "AI Recommendations",
    href: "/app/recommendations",
    badge: 1,
    icon: <CircleCheckIcon className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />,
  },
  {
    id: "experiments",
    label: "Experiments & Eval",
    href: "/app/experiments",
    icon: <BarChart3Icon className="size-4 shrink-0" aria-hidden="true" />,
  },
  {
    id: "reports",
    label: "Reports & Exports",
    href: "/app/reports",
    icon: <ArchiveIcon className="size-4 shrink-0" aria-hidden="true" />,
  },
];

const SCENARIOS = [
  { id: "INC-2026-0042", name: "INC-2026-0042 (APP-GW-02)", target: "APP-GW-02" },
  { id: "INC-2026-0043", name: "INC-2026-0043 (OT-CONTROLLER)", target: "OT-CONTROLLER-SIM-01" },
];

function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-[#FF6B35] text-white flex size-8 shrink-0 items-center justify-center rounded-lg shadow-sm font-bold",
        className
      )}
    >
      <svg
        viewBox="25.5002 25.1352 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
      >
        <circle cx="70.634" cy="29.8334" r="4.69799" fill="currentColor" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.668 57.0144V29.8332C25.668 27.2386 27.7713 25.1352 30.366 25.1352C32.9606 25.1352 35.0639 27.2386 35.0639 29.8332V57.0144C35.0639 61.833 38.9702 65.7392 43.7888 65.7392H57.2116C62.0302 65.7392 65.9364 61.833 65.9364 57.0144V43.7258C65.9364 41.1312 68.0398 39.0278 70.6344 39.0278C73.229 39.0278 75.3324 41.1312 75.3324 43.7258V57.0144C75.3324 67.0222 67.2194 75.1352 57.2116 75.1352H43.7888C33.7809 75.1352 25.668 67.0222 25.668 57.0144Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function WorkspaceSwitcher({
  workspace,
  onSelect,
}: {
  workspace: Workspace;
  onSelect: (workspace: Workspace) => void;
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-[#252525] aria-expanded:text-white"
              />
            }
          >
            <BrandMark />
            <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[state=collapsed]/sidebar:hidden">
              <span className="truncate text-xs font-bold text-[#F5F5F5]">
                GARDA-SIM AI
              </span>
              <span className="text-[#A3A3A3] truncate text-[11px]">
                {workspace.name}
              </span>
            </span>
            <ChevronsUpDownIcon className="ml-auto opacity-60 size-3.5 group-data-[state=collapsed]/sidebar:hidden" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Simulation Workspaces</DropdownMenuLabel>
              {WORKSPACES.map((item) => (
                <DropdownMenuItem key={item.id} onClick={() => onSelect(item)}>
                  <Avatar size="sm">
                    <AvatarFallback>{item.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium">{item.name}</span>
                    <span className="text-[10px] text-[#737373]">{item.plan}</span>
                  </div>
                  {item.id === workspace.id ? (
                    <CheckIcon className="ml-auto size-3.5 text-[#FF6B35]" aria-hidden="true" />
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => alert("Simulation workspace connected.")}>
                <PlusIcon className="size-3.5" aria-hidden="true" />
                <span>Connect Synthetic Cluster</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function WorkspaceNav({ pathname }: { pathname: string }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace Modules</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {MAIN_NAV.map((item) => {
            const isActive =
              item.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={<Link href={item.href} title={item.label} />}
                  isActive={isActive}
                  title={item.label}
                >
                  {item.icon}
                  <span className="group-data-[state=collapsed]/sidebar:hidden">{item.label}</span>
                </SidebarMenuButton>
                {item.badge ? (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function ScenarioNav() {
  const router = useRouter();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Active Scenarios</SidebarGroupLabel>
      <SidebarGroupAction
        type="button"
        onClick={() => router.push("/app/incidents")}
        title="View All Incidents"
      >
        <PlusIcon className="size-3.5" aria-hidden="true" />
        <span className="sr-only">View Incidents</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {SCENARIOS.map((sc) => (
            <SidebarMenuItem key={sc.id}>
              <SidebarMenuButton
                render={<Link href={`/app/incidents/${sc.id}`} title={sc.name} />}
                title={sc.name}
              >
                <FolderIcon className="size-4 shrink-0 text-[#737373]" aria-hidden="true" />
                <span className="truncate group-data-[state=collapsed]/sidebar:hidden">{sc.name}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuAction
                      showOnHover
                      aria-label={`Actions for ${sc.id}`}
                    />
                  }
                >
                  <MoreHorizontalIcon className="size-3.5" aria-hidden="true" />
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push(`/app/simulator?incident=${sc.id}`)}>
                      <RocketIcon className="size-3.5 text-[#FF6B35]" />
                      <span>Simulate Response</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/app/incidents/${sc.id}`)}>
                      <FileTextIcon className="size-3.5" />
                      <span>View Correlated Evidence</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(sc.id)}>
                      <CopyIcon className="size-3.5" />
                      <span>Copy Incident ID</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AccountMenu() {
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-[#252525] aria-expanded:text-white"
              />
            }
          >
            <Avatar size="default" className="size-8 rounded-lg shrink-0">
              <AvatarFallback className="rounded-lg bg-[#252525] text-xs font-semibold text-[#FF6B35]">NR</AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[state=collapsed]/sidebar:hidden">
              <span className="truncate text-xs font-semibold text-[#F5F5F5]">Nadia Rahman</span>
              <span className="text-[#737373] truncate text-[10px] font-mono">
                analyst-demo-03 · SOC L2
              </span>
            </span>
            <MoreHorizontalIcon className="ml-auto opacity-60 size-4 shrink-0 text-[#A3A3A3] group-data-[state=collapsed]/sidebar:hidden" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Operator Session</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/app/profile")}>
                <UserIcon className="size-3.5" aria-hidden="true" />
                <span>Operator Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/app/settings")}>
                <SettingsIcon className="size-3.5" aria-hidden="true" />
                <span>Workspace Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/app/audit-trail")}>
                <LayersIcon className="size-3.5" aria-hidden="true" />
                <span>Audit Trail Ledger</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/app/notifications")}>
                <BellIcon className="size-3.5" aria-hidden="true" />
                <span>Notifications</span>
                <DropdownMenuShortcut>2 new</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push("/login")}>
                <LogOutIcon className="size-3.5 text-red-400" aria-hidden="true" />
                <span className="text-red-400">Sign out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [workspace, setWorkspace] = React.useState<Workspace>(WORKSPACES[0]);

  return (
    <Sidebar variant="inset" className="h-full">
      <SidebarHeader>
        <WorkspaceSwitcher workspace={workspace} onSelect={setWorkspace} />
      </SidebarHeader>

      <SidebarContent role="navigation" aria-label="Workspace">
        <WorkspaceNav pathname={pathname} />
        <ScenarioNav />
      </SidebarContent>

      <SidebarFooter>
        {/* Sleek, Modern Simulation Badge preserving AGENTS.md rules */}
        <div className="mx-1 px-3 py-2 rounded-lg bg-[#1D1D1D] border border-[#2D2D2D] text-[10px] space-y-0.5 group-data-[state=collapsed]/sidebar:hidden">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold text-[#FF6B35] tracking-wider uppercase font-mono text-[10px]">
              <span className="size-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              SIMULATION ONLY
            </span>
            <span className="text-[10px] text-[#737373] font-mono">v1.0</span>
          </div>
          <div className="text-[#888888] text-[10px] leading-tight">
            Synthetic twin. Zero real mutations.
          </div>
        </div>

        {/* Collapsed Mode Simulation Dot Badge */}
        <div
          className="hidden group-data-[state=collapsed]/sidebar:flex size-9 mx-auto items-center justify-center rounded-lg bg-[#1D1D1D] border border-[#2D2D2D] text-[#FF6B35]"
          title="SIMULATION ONLY — Zero real production mutations"
        >
          <span className="size-2 rounded-full bg-[#FF6B35] animate-pulse" />
        </div>

        <SidebarSeparator className="mx-0 my-1 bg-[#282828] group-data-[state=collapsed]/sidebar:hidden" />
        <AccountMenu />
      </SidebarFooter>
    </Sidebar>
  );
}
