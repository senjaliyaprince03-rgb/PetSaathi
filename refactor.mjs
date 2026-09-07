const fs = require('fs');

const layoutCode = \import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentIdentity } from '@/modules/auth/session';

export default async function CustomerDashboardLayout({ children }: { children: React.ReactNode }) {
  const identity = await getCurrentIdentity();
  if (!identity) redirect('/login?returnTo=/dashboard');
  if (!identity.roles.includes('CUSTOMER')) {
    if (identity.roles.includes('SITTER')) redirect('/saathi');
    if (identity.roles.includes('SUPER_ADMIN') || identity.roles.includes('OPERATIONS_ADMIN')) redirect('/admin');
    redirect('/login');
  }

  const firstName = identity.displayName.split(' ')[0] || 'there';

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md min-h-screen overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed flex">
      {/* SideNavBar Component */}
      <nav className="w-[260px] md:w-sidebar h-screen fixed left-0 top-0 bg-surface-container-lowest hidden md:flex flex-col py-6 z-40 border-r border-outline-variant/30">
        <div className="px-6 mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
              P
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary">PetSaathi</h1>
              <p className="font-label-md text-label-md text-on-surface-variant">Verified Pet Care</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="font-label-lg text-label-lg">Overview</span>
          </Link>
          <Link href="/dashboard/history" className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-[20px]">history</span>
            <span className="font-label-lg text-label-lg">History</span>
          </Link>
          <Link href={"/pets" as any} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-[20px]">pets</span>
            <span className="font-label-lg text-label-lg">My Pets</span>
          </Link>
          <Link href={"/book" as any} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span className="font-label-lg text-label-lg">Book Care</span>
          </Link>
          <Link href={"/wallet" as any} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            <span className="font-label-lg text-label-lg">Service Wallet</span>
          </Link>
        </div>
        <div className="px-4 mt-auto pt-4 border-t border-outline-variant/30 flex flex-col gap-1">
          <Link href={"/support" as any} className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            <span className="font-label-lg text-label-lg">Help &amp; Support</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full md:ml-[260px] min-h-screen pb-20 md:pb-0 bg-surface flex flex-col">
        {/* TopAppBar */}
        <header className="bg-surface h-20 w-full sticky top-0 z-40 border-b border-on-surface/10 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md font-bold text-primary md:hidden">PetSaathi</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link href={"/book" as any} className="text-secondary font-headline-md text-headline-md hover:bg-on-surface/5 transition-colors p-2 rounded-full hidden sm:block">
              + Book Care Now
            </Link>
            <button className="text-on-surface-variant hover:bg-on-surface/5 transition-colors p-2 rounded-full relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border-2 border-surface-container-lowest flex items-center justify-center font-bold text-primary">
              {firstName[0]}
            </div>
          </div>
        </header>

        <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-on-surface/10 flex justify-around items-center h-16 z-50 px-2 pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-label-md text-label-md">Overview</span>
        </Link>
        <Link href="/dashboard/history" className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">history</span>
          <span className="font-label-md text-label-md">History</span>
        </Link>
        <Link href={"/pets" as any} className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">pets</span>
          <span className="font-label-md text-label-md">My Pets</span>
        </Link>
        <Link href={"/book" as any} className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="font-label-md text-label-md">Book Care</span>
        </Link>
      </nav>
    </div>
  );
}
\;

fs.writeFileSync('c:\\\\Users\\\\Prince\\\\Downloads\\\\PetSaathi\\\\src\\\\app\\\\(portal)\\\\dashboard\\\\layout.tsx', layoutCode);
