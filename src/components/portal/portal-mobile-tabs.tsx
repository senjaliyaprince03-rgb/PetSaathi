"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { cn } from "@/lib/cn";
import {
  Home,
  PawPrint,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
  WalletCards,
  Inbox,
  Handshake,
  Bell,
  Settings2,
  Headphones,
  ShieldCheck,
  Clock3,
  UserRound,
  SlidersHorizontal,
  BadgeCheck,
  Flag,
  FileLock2,
  BookOpen,
  Users,
  Megaphone,
  MapPin,
  Activity,
  DollarSign
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Home,
  PawPrint,
  CalendarDays,
  ClipboardCheck,
  Sparkles,
  WalletCards,
  Inbox,
  Handshake,
  Bell,
  Settings2,
  Headphones,
  ShieldCheck,
  Clock3,
  UserRound,
  SlidersHorizontal,
  BadgeCheck,
  Flag,
  FileLock2,
  BookOpen,
  Users,
  Megaphone,
  MapPin,
  Activity,
  DollarSign
};

export interface SerializableNavLink {
  iconName: string;
  label: string;
  href: string;
}

export function PortalMobileTabs({ links }: { links: Array<SerializableNavLink> }) {
  const pathname = usePathname();

  return (
    <nav className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="Mobile workspace navigation">
      {links.map(({ iconName, label, href }) => {
        const NavIcon = iconMap[iconName] || Home;
        const isActive = pathname === href;
        return (
          <Link
            key={label}
            href={href as Route}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold",
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-indigo/10 bg-paper text-ink/60"
            )}
          >
            <NavIcon className="h-3.5 w-3.5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
