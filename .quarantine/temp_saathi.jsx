
<!-- SideNavBar Component -->
<nav className="w-sidebar h-full fixed left-0 top-0 bg-surface-container-lowest flex flex-col h-screen py-margin-desktop z-40 border-r border-outline-variant/30">
<!-- Header -->
<div className="px-6 mb-8 flex flex-col gap-2">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant">
<img alt="Caregiver Profile Picture" className="w-full h-full object-cover" data-alt="Professional portrait photograph of a confident caregiver, softly lit against a neutral light grey background, high resolution, soft modern aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOQWOI677HQz-jrk3f6nv8SrLue56vPhWAvjg_F2TCMV-enLc73P6tVTQznuEGWVGShbow0AkqwomFx4o7y9CVTnZktLtiDD1_rFsNYjemOq7AhLOJUsJKLou2zOh2upDKZDcy_kAmREz3OTTigfahPoDv-nXAAmaaa9gYF5F1DcfTZw0uKnPR_f0hSfPbJ0QQhcPv9H__XJhwypHUULIwLHXwO5lITHjkjh_8bzsAJKmVghcPvbVG"/>
</div>
<div>
<h1 className="font-headline-md text-headline-md font-bold text-primary">Saathi Portal</h1>
<p className="font-label-md text-label-md text-on-surface-variant">Professional Cockpit</p>
</div>
</div>
<button className="mt-4 w-full bg-primary text-on-primary py-2.5 px-4 rounded-full font-label-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-colors duration-200 shadow-sm flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[18px]">bolt</span>
                View Active Tasks
            </button>
</div>
<!-- Main Tabs -->
<div className="flex-1 overflow-y-auto px-4 flex flex-col gap-1">
<!-- Active Tab: Mission Control -->
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary font-bold border-r-4 border-primary bg-surface-container cursor-pointer active:scale-95 transition-colors duration-200" href="#">
<span className="material-symbols-outlined icon-filled text-[20px]" data-icon="dashboard">dashboard</span>
<span className="font-label-lg text-label-lg">Mission Control</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="assignment">assignment</span>
<span className="font-label-lg text-label-lg">Assignments Queue</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="description">description</span>
<span className="font-label-lg text-label-lg">Care Reports</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="account_balance_wallet">account_balance_wallet</span>
<span className="font-label-lg text-label-lg">Wallet &amp; Payouts</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="calendar_month">calendar_month</span>
<span className="font-label-lg text-label-lg">My Availability</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="equalizer">equalizer</span>
<span className="font-label-lg text-label-lg">Performance</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="school">school</span>
<span className="font-label-lg text-label-lg">Saathi Academy</span>
</a>
</div>
<!-- Footer Tabs -->
<div className="px-4 mt-auto pt-4 border-t border-outline-variant/30 flex flex-col gap-1">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="settings">settings</span>
<span className="font-label-lg text-label-lg">Settings</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors duration-200 cursor-pointer active:scale-95" href="#">
<span className="material-symbols-outlined text-[20px]" data-icon="help_outline">help_outline</span>
<span className="font-label-lg text-label-lg">Support</span>
</a>
</div>
</nav>
<!-- Main Content Canvas -->
<div className="flex-1 ml-sidebar flex flex-col min-w-0 bg-surface">
<!-- TopAppBar Component -->
<header className="bg-surface docked full-width top-0 sticky z-50 border-b border-outline-variant flex justify-between items-center h-16 px-margin-desktop">
<div className="flex items-center gap-4">
<span className="font-headline-sm text-headline-sm font-bold text-primary">PetSaathi</span>
</div>
<div className="flex items-center gap-6">
<!-- Status Toggle -->
<button className="flex items-center gap-2 bg-status-accepted/15 text-status-accepted px-3 py-1.5 rounded-full font-label-md text-label-md cursor-pointer active:opacity-80 transition-all hover:bg-status-accepted/25 border border-status-accepted/20" id="statusToggleBtn">
<span className="w-2 h-2 rounded-full bg-status-accepted animate-pulse"></span>
                    Online
                </button>
<div className="flex items-center gap-4 text-on-surface-variant">
<button className="cursor-pointer active:opacity-80 hover:text-primary transition-colors flex items-center justify-center relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface"></span>
</button>
<button className="cursor-pointer active:opacity-80 hover:text-primary transition-colors flex items-center justify-center">
<span className="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</header>
<!-- Scrollable Dashboard Area -->
<main className="flex-1 overflow-y-auto p-margin-desktop relative">
<!-- OFFLINE OVERLAY (Hidden by default, toggled via JS) -->
<div className="absolute inset-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md hidden flex-col items-center justify-center px-4" id="offlineOverlay">
<div className="bg-surface p-8 rounded-xl border border-outline-variant shadow-lg max-w-md w-full text-center flex flex-col items-center">
<div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
<span className="material-symbols-outlined text-[40px] text-outline">wifi_off</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">You're currently offline.</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Go online to receive new assignment requests in your area and manage your queue.</p>
<button className="w-full bg-primary text-on-primary py-3 px-6 rounded-lg font-label-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm flex items-center justify-center gap-2" id="goOnlineBtn">
<span className="material-symbols-outlined">wifi</span>
                        Go Online &amp; Accept Jobs
                    </button>
</div>
</div>
<!-- DASHBOARD CONTENT (Main State) -->
<div className="max-w-6xl mx-auto flex flex-col gap-8">
<!-- Page Header & Status Banner -->
<div className="flex flex-col gap-6">
<h1 className="font-headline-lg text-headline-lg text-on-surface">Mission Control</h1>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
<!-- Decorative subtle shape -->
<div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl"></div>
<div className="flex items-center gap-4 relative z-10">
<div className="w-12 h-12 rounded-full bg-status-accepted/15 flex items-center justify-center">
<span className="material-symbols-outlined text-status-accepted icon-filled">check_circle</span>
</div>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">You're all caught up.</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1 flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">schedule</span>
                                    Next assignment in <strong className="text-primary font-semibold">45 minutes</strong>
</p>
</div>
</div>
<button className="relative z-10 px-5 py-2.5 rounded-lg border border-outline-variant text-primary font-label-lg text-label-lg hover:bg-surface-container-high transition-colors flex items-center gap-2 bg-surface-container-lowest">
                            View Schedule
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
</div>
<!-- Bento Grid: Stats & Performance -->
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
<!-- Today's Stats Cards -->
<div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
<!-- Earned -->
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-primary-fixed-dim transition-colors group">
<div className="flex items-center justify-between mb-4">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Today's Earnings</span>
<span className="material-symbols-outlined text-wallet-green bg-wallet-green/10 p-1.5 rounded-md text-[18px]">payments</span>
</div>
<div>
<span className="font-headline-lg text-headline-lg font-bold text-on-surface font-data-mono">₹1,850</span>
<p className="font-label-md text-label-md text-wallet-green mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span> +12% from avg
                                </p>
</div>
</div>
<!-- Completed -->
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-primary-fixed-dim transition-colors">
<div className="flex items-center justify-between mb-4">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Completed</span>
<span className="material-symbols-outlined text-status-completed bg-status-completed/10 p-1.5 rounded-md text-[18px]">task_alt</span>
</div>
<div>
<span className="font-headline-lg text-headline-lg font-bold text-on-surface">3</span>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Jobs finished</p>
</div>
</div>
<!-- Upcoming -->
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col justify-between shadow-sm hover:border-primary-fixed-dim transition-colors">
<div className="flex items-center justify-between mb-4">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Upcoming</span>
<span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-md text-[18px]">pending_actions</span>
</div>
<div>
<span className="font-headline-lg text-headline-lg font-bold text-on-surface">2</span>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">In queue</p>
</div>
</div>
</div>
<!-- Performance Overview Card -->
<div className="bg-primary text-on-primary rounded-xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden h-full min-h-[160px]">
<!-- Abstract BG -->
<div className="absolute inset-0 opacity-20 pointer-events-none" data-alt="Abstract modern background with soft glowing purple and gold gradient waves, minimal and professional saas aesthetic." style={{ backgroundImage: `url('...')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
<div className="relative z-10">
<div className="flex items-center gap-2 mb-2 text-primary-fixed">
<span className="material-symbols-outlined text-[18px]">workspace_premium</span>
<span className="font-label-md text-label-md uppercase tracking-wider">Trust &amp; Quality</span>
</div>
<div className="flex items-baseline gap-1 mt-2">
<span className="font-headline-lg text-headline-lg font-bold">99.2</span>
<span className="font-label-lg text-label-lg">%</span>
</div>
<p className="font-body-md text-body-md text-primary-fixed-dim mt-2 text-sm">Top 5% of Saathis</p>
</div>
</div>
</div>
<!-- Quick Actions -->
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Quick Actions</h3>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<button className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-surface-container hover:border-outline transition-all duration-200 group text-center h-28">
<span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">assignment_ind</span>
<span className="font-label-lg text-label-lg text-on-surface">View Assignments</span>
</button>
<button className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-surface-container hover:border-outline transition-all duration-200 group text-center h-28">
<span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">edit_calendar</span>
<span className="font-label-lg text-label-lg text-on-surface">Update Availability</span>
</button>
<button className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-surface-container hover:border-outline transition-all duration-200 group text-center h-28">
<span className="material-symbols-outlined text-[28px] text-primary group-hover:scale-110 transition-transform">account_balance_wallet</span>
<span className="font-label-lg text-label-lg text-on-surface">View Wallet</span>
</button>
<button className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col items-center justify-center gap-3 hover:bg-surface-container hover:border-outline transition-all duration-200 group text-center h-28 border-l-4 border-l-academy-purple">
<span className="material-symbols-outlined text-[28px] text-academy-purple group-hover:scale-110 transition-transform">school</span>
<span className="font-label-lg text-label-lg text-on-surface">Start Learning</span>
</button>
</div>
</div>
</div>
<div className="h-12"></div> <!-- Bottom padding -->
</main>
</div>

