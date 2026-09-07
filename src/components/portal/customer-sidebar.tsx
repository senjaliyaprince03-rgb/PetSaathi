"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bookmark,
  CalendarDays, 
  ClipboardList, 
  Gift, 
  History, 
  Inbox, 
  LayoutDashboard, 
  LayoutGrid, 
  LogOut, 
  PawPrint, 
  Plus, 
  Settings, 
  Share2, 
  Shield, 
  ShieldCheck, 
  WalletCards 
} from 'lucide-react';
import { PetSaathiLogo } from '@/components/brand/logo';

export function CustomerSidebar() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = href === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname === href || pathname?.startsWith(href + '/');

    if (isActive) {
      return "flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-indigo bg-indigo/10 border-l-4 border-indigo font-bold text-xs transition-all duration-150 shadow-2xs";
    }
    return "flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-ink/75 hover:text-ink hover:bg-ink/5 border-l-4 border-transparent text-xs font-medium transition-all duration-150";
  };

  const getMobileLinkClass = (href: string) => {
    const isActive = href === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname === href || pathname?.startsWith(href + '/');

    if (isActive) {
      return "flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-indigo font-bold bg-indigo/5 transition-all";
    }
    return "flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-ink/70 hover:text-ink hover:bg-black/5 transition-all";
  };

  return (
    <>
      {/* Desktop Static Fixed Sidebar */}
      <aside className="w-[280px] h-screen max-h-screen fixed left-0 top-0 bottom-0 border-r border-ink/10 bg-white hidden md:flex flex-col py-3.5 px-3 z-50 shadow-[4px_0px_24px_rgba(48,31,48,0.02)] select-none overflow-hidden justify-between">
        
        {/* Top: Brand Header with Logo */}
        <div className="px-2 mb-2 shrink-0">
          <PetSaathiLogo href="/dashboard" />
          <div className="mt-1.5 flex items-center justify-between px-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
              Customer Hub
            </span>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Live Network
            </span>
          </div>
        </div>

        {/* Middle: Navigation Sections (Clean, Pinned, Hidden Scrollbar) */}
        <div className="flex-1 space-y-2.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Main Menu Group */}
          <div>
            <span className="px-2 text-[9px] font-extrabold uppercase tracking-wider text-ink/40 mb-0.5 block">
              Main Menu
            </span>
            <nav className="space-y-0.5">
              <Link href={"/dashboard" as any} className={getLinkClass("/dashboard")}>
                <LayoutDashboard className="w-4 h-4 text-inherit shrink-0" />
                <span>Overview</span>
              </Link>
              <Link href={"/dashboard/history" as any} className={getLinkClass("/dashboard/history")}>
                <History className="w-4 h-4 text-inherit shrink-0" />
                <span>Care History</span>
              </Link>
              <Link href={"/pets" as any} className={getLinkClass("/pets")}>
                <PawPrint className="w-4 h-4 text-inherit shrink-0" />
                <span>My Pets & Passports</span>
              </Link>
              <Link href={"/book" as any} className={getLinkClass("/book")}>
                <CalendarDays className="w-4 h-4 text-inherit shrink-0" />
                <span>Book Care</span>
              </Link>
              <Link href={"/customer/wallet" as any} className={getLinkClass("/customer/wallet")}>
                <WalletCards className="w-4 h-4 text-inherit shrink-0" />
                <span>Service Wallet</span>
              </Link>
            </nav>
          </div>

          {/* Care Ecosystem Group */}
          <div>
            <span className="px-2 text-[9px] font-extrabold uppercase tracking-wider text-ink/40 mb-0.5 block">
              Care Ecosystem
            </span>
            <nav className="space-y-0.5">
              <Link href={"/customer/services" as any} className={getLinkClass("/customer/services")}>
                <LayoutGrid className="w-4 h-4 text-inherit shrink-0" />
                <span>All Services</span>
              </Link>
              <Link href={"/customer/subscriptions" as any} className={getLinkClass("/customer/subscriptions")}>
                <Bookmark className="w-4 h-4 text-inherit shrink-0" />
                <span>Care Passes</span>
              </Link>
              <Link href={"/customer/loyalty" as any} className={getLinkClass("/customer/loyalty")}>
                <Gift className="w-4 h-4 text-inherit shrink-0" />
                <span>Paws Rewards</span>
              </Link>
              <Link href={"/customer/protocols" as any} className={getLinkClass("/customer/protocols")}>
                <ClipboardList className="w-4 h-4 text-inherit shrink-0" />
                <span>Care Protocols</span>
              </Link>
              <Link href={"/customer/inbox" as any} className={getLinkClass("/customer/inbox")}>
                <Inbox className="w-4 h-4 text-inherit shrink-0" />
                <span>Protocol Inbox</span>
              </Link>
              <Link href={"/customer/referrals" as any} className={getLinkClass("/customer/referrals")}>
                <Share2 className="w-4 h-4 text-inherit shrink-0" />
                <span>Refer a Friend</span>
              </Link>
            </nav>
          </div>

          {/* Safety & Settings Group */}
          <div>
            <span className="px-2 text-[9px] font-extrabold uppercase tracking-wider text-ink/40 mb-0.5 block">
              Safety & Settings
            </span>
            <nav className="space-y-0.5">
              <Link href={"/settings" as any} className={getLinkClass("/settings")}>
                <Settings className="w-4 h-4 text-inherit shrink-0" />
                <span>Account Settings</span>
              </Link>
              <Link href={"/safety" as any} className={getLinkClass("/safety")}>
                <Shield className="w-4 h-4 text-inherit shrink-0" />
                <span>Trust & Safety</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom: Footer Guarantee Card & Sign Out */}
        <div className="shrink-0 pt-2 border-t border-ink/10 space-y-1.5">
          {/* Verified Guarantee Pill */}
          <div className="p-2 rounded-xl bg-[#432662]/5 border border-[#432662]/10 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-ink block leading-tight">₹50,000 Vet Cover</span>
              <span className="text-[9px] text-ink/60 block leading-tight">Active on every booking</span>
            </div>
          </div>

          {/* Quick Sign Out Action */}
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-ink/10 flex justify-around items-center h-[68px] z-50 px-2 pb-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <Link href={"/dashboard" as any} className={getMobileLinkClass("/dashboard")}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Overview</span>
        </Link>
        <Link href={"/dashboard/history" as any} className={getMobileLinkClass("/dashboard/history")}>
          <History className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">History</span>
        </Link>
        <Link href={"/pets" as any} className={getMobileLinkClass("/pets")}>
          <PawPrint className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">My Pets</span>
        </Link>
        <Link href={"/book" as any} className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] -mt-3.5 px-2 py-1 active:scale-95 transition-transform">
          <div className="w-11 h-11 rounded-full bg-[#E16649] text-white flex items-center justify-center shadow-lg shadow-[#E16649]/30">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 text-[#E16649] font-extrabold">Book</span>
        </Link>
        <Link href={"/customer/wallet" as any} className={getMobileLinkClass("/customer/wallet")}>
          <WalletCards className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-medium">Wallet</span>
        </Link>
      </nav>
    </>
  );
}
