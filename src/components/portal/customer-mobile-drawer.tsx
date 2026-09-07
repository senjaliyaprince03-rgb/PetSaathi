"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity,
  Award,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  Compass,
  FileHeart,
  HeartHandshake,
  HelpCircle,
  Inbox,
  LogOut,
  Menu,
  PawPrint,
  Settings,
  ShieldCheck,
  UserCheck,
  Wallet,
  X 
} from "lucide-react";
import { PetSaathiLogo } from "@/components/brand/logo";

interface CustomerMobileDrawerProps {
  displayName: string;
}

export function CustomerMobileDrawer({ displayName }: CustomerMobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navItems = [
    { label: "Overview", href: "/dashboard", icon: Compass },
    { label: "Care History", href: "/dashboard/history", icon: Activity },
    { label: "My Pets & Passports", href: "/pets", icon: FileHeart },
    { label: "Book Care", href: "/book", icon: CalendarCheck },
    { label: "Service Wallet", href: "/customer/wallet", icon: Wallet },
    { label: "All Services", href: "/customer/services", icon: PawPrint },
    { label: "Care Passes", href: "/customer/subscriptions", icon: Award },
    { label: "Paws Rewards", href: "/customer/loyalty", icon: HeartHandshake },
    { label: "Care Protocols", href: "/customer/protocols", icon: ClipboardList },
    { label: "Protocol Inbox", href: "/customer/inbox", icon: Inbox },
    { label: "Refer a Friend", href: "/customer/referrals", icon: UserCheck },
    { label: "Account Settings", href: "/settings", icon: Settings },
    { label: "Trust & Safety", href: "/safety", icon: ShieldCheck },
    { label: "24/7 Care Support", href: "/support", icon: HelpCircle },
  ];

  const drawerContent = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-[99999] flex flex-col bg-[#FAF6F1] md:hidden animate-in fade-in duration-150">
      {/* Drawer Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 bg-white shadow-xs shrink-0">
        <PetSaathiLogo />
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface border border-ink/10 text-ink hover:bg-ink/5 active:scale-95 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User & Society Pill */}
      <div className="px-5 py-3 bg-white/70 border-b border-ink/5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo/10 text-indigo flex items-center justify-center font-bold text-xs">
            {displayName ? displayName.charAt(0).toUpperCase() : "P"}
          </div>
          <div>
            <span className="text-xs font-bold text-ink block">{displayName || "Pet Parent"}</span>
            <span className="text-[10px] text-ink/60">Indiranagar Care Hub</span>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Network
        </span>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-4 py-3 space-y-1 bg-[#FAF6F1]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href as any}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-indigo/10 text-indigo border-l-4 border-indigo"
                  : "text-ink/80 hover:text-ink hover:bg-ink/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo" : "text-ink/60"}`} />
                <span>{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-ink/30" />
            </Link>
          );
        })}
      </nav>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-ink/10 bg-white/80 flex items-center justify-between shrink-0">
        <Link
          href="/book"
          className="flex-1 py-2.5 bg-[#E16649] hover:bg-[#d05538] text-white font-bold text-xs text-center rounded-xl shadow-md mr-3"
        >
          Book New Care
        </Link>
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit</span>
        </Link>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open mobile portal menu"
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-ink/10 text-ink shadow-2xs hover:bg-surface active:scale-95 transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {drawerContent}
    </>
  );
}
