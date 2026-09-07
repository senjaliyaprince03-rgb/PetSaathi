
<!-- SideNavBar -->
<nav className="w-[260px] h-screen fixed left-0 top-0 border-r border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface flex flex-col py-container_padding z-50">
<div className="px-container_padding mb-8">
<h1 className="text-h2 font-display font-bold text-primary dark:text-primary-fixed">PetSaathi Ops</h1>
<div className="mt-4 flex items-center gap-3">
<img className="w-10 h-10 rounded-full object-cover" data-alt="A small, professional circular avatar portrait of an Indian woman named Neha Patel in a corporate setting. High key lighting, clean modern aesthetic, conveying reliability and operational authority." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp3_w9IGFKQhv8Da69_Q69SNTqkbhGd0Fvd0onZSR9ACYPHa_eM2-K71Ez2KdDtQlnBaEDM1_bFkW-_gFqppws912qn7cSPesmpGWgMv7pPSo1fQN4zkBMqkMavWzIOdr_TcxJKYQOsXrysHdQX4J3BVLRx3b1uwrx_YAQ99F3PLfRRIDfLbtv73xTPAm4pbgnPOQKjAj3X3W5vUdGF6Vn93bCKXjMDo9LEKGEUA1qbV2QHoVUG8U_"/>
<div>
<p className="font-label-md text-on-surface">Neha Patel</p>
<p className="font-label-md text-on-surface-variant">Super Admin</p>
</div>
</div>
<div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-label-md text-on-surface-variant tracking-wider uppercase">PRODUCTION</span>
</div>
</div>
<div className="flex-1 overflow-y-auto px-4 space-y-1">
<!-- Active Tab -->
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary dark:text-primary-fixed-dim font-bold bg-primary-container/10 dark:bg-primary-container/20 cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
<span className="font-display text-body-md">Operations Command</span>
</a>
<!-- Inactive Tabs -->
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">event_seat</span>
<span className="font-display text-body-md">Booking Control</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">security</span>
<span className="font-display text-body-md">Safety &amp; Incidents</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">payments</span>
<span className="font-display text-body-md">Finance &amp; Payouts</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">category</span>
<span className="font-display text-body-md">Service Catalog</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">location_city</span>
<span className="font-display text-body-md">City Capacity</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">groups</span>
<span className="font-display text-body-md">People &amp; Pets</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">chat</span>
<span className="font-display text-body-md">Communication</span>
</a>
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="font-display text-body-md">System Settings</span>
</a>
</div>
<div className="mt-auto px-4 pt-4 border-t border-outline-variant dark:border-outline">
<a className="flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors cursor-pointer active:scale-[0.98]" href="#">
<span className="material-symbols-outlined">help</span>
<span className="font-display text-body-md">Help Center</span>
</a>
</div>
</nav>
<!-- TopAppBar -->
<header className="h-[56px] w-[calc(100%-260px)] fixed top-0 right-0 z-40 bg-surface-bright dark:bg-surface-dim border-b border-outline-variant dark:border-outline flex justify-between items-center px-gutter ml-[260px]">
<div className="flex items-center gap-8">
<div className="font-display text-h1 font-bold text-primary dark:text-primary-fixed hidden lg:block">PetSaathi Operations</div>
<nav className="hidden md:flex gap-6 h-full">
<a className="h-full flex items-center text-primary dark:text-primary-fixed-dim border-b-2 border-primary font-display text-h2 hover:text-primary dark:hover:text-primary-fixed-dim transition-all focus-within:ring-2 focus-within:ring-primary" href="#">Operations</a>
<a className="h-full flex items-center text-on-surface-variant dark:text-outline-variant font-display text-h2 hover:text-primary dark:hover:text-primary-fixed-dim transition-all focus-within:ring-2 focus-within:ring-primary" href="#">Safety</a>
<a className="h-full flex items-center text-on-surface-variant dark:text-outline-variant font-display text-h2 hover:text-primary dark:hover:text-primary-fixed-dim transition-all focus-within:ring-2 focus-within:ring-primary" href="#">Finance</a>
<a className="h-full flex items-center text-on-surface-variant dark:text-outline-variant font-display text-h2 hover:text-primary dark:hover:text-primary-fixed-dim transition-all focus-within:ring-2 focus-within:ring-primary" href="#">Network</a>
</nav>
</div>
<div className="flex items-center gap-4">
<!-- Search Bar placeholder for "on_left" (moved to right for layout balance here, assuming standard top bar layout) -->
<div className="relative hidden sm:block">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="pl-10 pr-4 py-1.5 bg-surface-container-high border-none rounded-full text-body-sm focus:ring-2 focus:ring-primary w-64 text-on-surface placeholder:text-on-surface-variant" placeholder="Search operations (Cmd+K)" type="text"/>
</div>
<div className="flex items-center gap-2">
<button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant focus-within:ring-2 focus-within:ring-primary">
<span className="material-symbols-outlined">sensors</span>
</button>
<button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant focus-within:ring-2 focus-within:ring-primary relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
</button>
<button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant focus-within:ring-2 focus-within:ring-primary">
<span className="material-symbols-outlined">dark_mode</span>
</button>
<button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant focus-within:ring-2 focus-within:ring-primary">
<span className="material-symbols-outlined">help</span>
</button>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main className="ml-[260px] mt-[56px] w-[calc(100%-260px)] h-[calc(100vh-56px)] overflow-y-auto bg-background p-container_padding flex flex-col gap-6">
<!-- Header -->
<div>
<h2 className="font-display text-display text-on-surface">Operations Command</h2>
<p className="font-body-lg text-on-surface-variant mt-1">Real-time platform health, care activity and operational queues.</p>
</div>
<!-- System Health Strip -->
<div className="flex gap-4 p-4 rounded-xl border border-outline-variant bg-surface-container-lowest overflow-x-auto no-scrollbar">
<div className="flex items-center gap-2 flex-shrink-0 pr-6 border-r border-outline-variant">
<span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span className="font-label-md text-on-surface uppercase tracking-wider">Matching Engine</span>
<span className="font-mono text-primary text-xs ml-2">Nominal</span>
</div>
<div className="flex items-center gap-2 flex-shrink-0 px-6 border-r border-outline-variant">
<span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span className="font-label-md text-on-surface uppercase tracking-wider">GPS Webhook</span>
<span className="font-mono text-primary text-xs ml-2">99.9%</span>
</div>
<div className="flex items-center gap-2 flex-shrink-0 px-6 border-r border-outline-variant">
<span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span className="font-label-md text-on-surface uppercase tracking-wider">Razorpay</span>
<span className="font-mono text-primary text-xs ml-2">Reconciled</span>
</div>
<div className="flex items-center gap-2 flex-shrink-0 pl-6">
<span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
<span className="font-label-md text-on-surface uppercase tracking-wider">Database</span>
<span className="font-mono text-primary text-xs ml-2">Operational</span>
</div>
</div>
<!-- KPI Row - Bento Grid Style -->
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
<!-- KPI 1 -->
<div className="p-5 rounded-xl border border-outline-variant bg-surface-container-lowest flex flex-col gap-1">
<p className="font-label-md text-on-surface-variant uppercase tracking-wider">Active Bookings</p>
<div className="flex items-baseline gap-2">
<h3 className="font-display text-[32px] font-semibold text-on-surface leading-tight">42</h3>
</div>
<div className="inline-flex items-center mt-2 px-2 py-1 rounded bg-secondary-container/50 w-fit">
<span className="font-label-md text-secondary">In Progress</span>
</div>
</div>
<!-- KPI 2 -->
<div className="p-5 rounded-xl border border-outline-variant bg-surface-container-lowest flex flex-col gap-1">
<p className="font-label-md text-on-surface-variant uppercase tracking-wider">Matching Queue</p>
<div className="flex items-baseline gap-2">
<h3 className="font-display text-[32px] font-semibold text-on-surface leading-tight">6</h3>
</div>
<div className="inline-flex items-center mt-2 px-2 py-1 rounded bg-tertiary-container/30 w-fit">
<span className="font-label-md text-tertiary">Waiting</span>
</div>
</div>
<!-- KPI 3 -->
<div className="p-5 rounded-xl border border-error-container bg-error-container/10 flex flex-col gap-1 relative overflow-hidden">
<div className="absolute top-0 right-0 w-16 h-16 bg-error/5 rounded-bl-full"></div>
<p className="font-label-md text-on-error-container uppercase tracking-wider">Risk Review</p>
<div className="flex items-baseline gap-2">
<h3 className="font-display text-[32px] font-semibold text-error leading-tight">2</h3>
</div>
<div className="inline-flex items-center mt-2 px-2 py-1 rounded bg-error-container w-fit">
<span className="font-label-md text-on-error-container">Pending Action</span>
</div>
</div>
<!-- KPI 4 -->
<div className="p-5 rounded-xl border border-outline-variant bg-surface-container-lowest flex flex-col gap-1">
<p className="font-label-md text-on-surface-variant uppercase tracking-wider">Pending Reports</p>
<div className="flex items-baseline gap-2">
<h3 className="font-display text-[32px] font-semibold text-on-surface leading-tight">5</h3>
</div>
<div className="inline-flex items-center mt-2 px-2 py-1 rounded bg-surface-variant w-fit">
<span className="font-label-md text-on-surface-variant">Awaiting Sign-off</span>
</div>
</div>
<!-- KPI 5 -->
<div className="p-5 rounded-xl border border-primary-container bg-primary-container/5 flex flex-col gap-1">
<p className="font-label-md text-primary uppercase tracking-wider">GMV Today</p>
<div className="flex items-baseline gap-2">
<h3 className="font-display text-[32px] font-semibold text-primary leading-tight">₹84.2K</h3>
</div>
<div className="inline-flex items-center mt-2 px-2 py-1 rounded bg-primary-container/20 w-fit">
<span className="material-symbols-outlined text-[14px] text-primary mr-1">trending_up</span>
<span className="font-label-md text-primary">On Target</span>
</div>
</div>
</div>
<!-- Main Workspace: Map and Alerts -->
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
<!-- Live Operations Map -->
<div className="lg:col-span-2 rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden flex flex-col relative">
<div className="p-4 border-b border-outline-variant flex justify-between items-center bg-white/50 backdrop-blur-sm z-10">
<h3 className="font-h2 text-on-surface">Live Network</h3>
<div className="flex gap-2">
<span className="px-3 py-1 rounded-full border border-outline-variant font-label-md text-on-surface-variant bg-surface">Ahmedabad</span>
<span className="px-3 py-1 rounded-full border border-outline-variant font-label-md text-on-surface-variant bg-surface">Surat</span>
<span className="px-3 py-1 rounded-full border border-outline-variant font-label-md text-on-surface-variant bg-surface">Bangalore</span>
</div>
</div>
<!-- Map Background Placeholder -->
<div className="absolute inset-0 top-[61px] bg-surface-variant" data-location="India" style="">
<img className="w-full h-full object-cover opacity-60 mix-blend-multiply" data-alt="A highly detailed, minimalist vector map of India focused on Ahmedabad, Surat, and Bangalore regions. Styled in a clean corporate light mode aesthetic using light grays and subtle purple/indigo accents from the design system. The map serves as a clean background for an operational dashboard, devoid of excessive labels, emphasizing clean geographic boundaries." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfambAxjD-gzK0wSki1o1y6sQt4uOffb84siybeP-QfeDe9SustrrYQrSe3InNfOzqFglo01_TtqFLS2jFNQnC0i8f0Gy0PvBKcw___oIQcxZGbFzAxDtoth-ispWirF3BENn9Rg3wm6nyMuZUYXqw6iE5SstihVDb4YwAPjjx8jYK6kW2fIF5f6EGMjvqWI9XAIQVYwEbsF58AErMnwyV23LjQD6z2gUA_Bzh6Zix_uhW_Y0tQjqf"/>
<!-- Map Markers (Simulated) -->
<div className="absolute top-[30%] left-[20%] w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20 animate-pulse"></div>
<div className="absolute top-[35%] left-[25%] w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20"></div>
<div className="absolute top-[60%] left-[30%] w-4 h-4 bg-error rounded-full ring-4 ring-error/20 animate-bounce"></div>
<div className="absolute top-[80%] left-[40%] w-3 h-3 bg-tertiary rounded-full ring-4 ring-tertiary/20"></div>
</div>
<!-- Map Controls Overlay -->
<div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
<button className="w-10 h-10 bg-surface border border-outline-variant rounded-lg flex items-center justify-center text-on-surface shadow-sm hover:bg-surface-variant">
<span className="material-symbols-outlined">add</span>
</button>
<button className="w-10 h-10 bg-surface border border-outline-variant rounded-lg flex items-center justify-center text-on-surface shadow-sm hover:bg-surface-variant">
<span className="material-symbols-outlined">remove</span>
</button>
</div>
</div>
<!-- Real-time Alert Feed -->
<div className="rounded-xl border border-outline-variant bg-surface-container-lowest flex flex-col h-full">
<div className="p-4 border-b border-outline-variant flex justify-between items-center">
<h3 className="font-h2 text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-error">warning</span>
                        Active Alerts
                    </h3>
<span className="font-label-md text-on-surface-variant bg-surface-variant px-2 py-1 rounded">3 Unresolved</span>
</div>
<div className="flex-1 overflow-y-auto p-2 space-y-2">
<!-- Alert 1: Critical -->
<div className="p-3 rounded-lg border-l-4 border-error bg-surface hover:bg-surface-variant transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-1">
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">Critical</span>
<span className="font-mono text-on-surface-variant text-[11px]">10:45 AM</span>
</div>
<p className="font-body-md text-on-surface font-medium">Late check-in</p>
<div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-on-surface-variant">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> Ahmedabad</span>
<span>#BK-2026-8821</span>
</div>
<div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-[12px] font-medium text-primary hover:underline">Review Booking →</button>
</div>
</div>
<!-- Alert 2: High Risk -->
<div className="p-3 rounded-lg border-l-4 border-error bg-surface hover:bg-surface-variant transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-1">
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-error-container text-on-error-container">High Risk</span>
<span className="font-mono text-on-surface-variant text-[11px]">10:40 AM</span>
</div>
<p className="font-body-md text-on-surface font-medium">Pet safety alert triggered</p>
<div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-on-surface-variant">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> Bangalore</span>
<span>System Trigger</span>
</div>
<div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-[12px] font-medium text-primary hover:underline">Open Incident →</button>
</div>
</div>
<!-- Alert 3: Warning -->
<div className="p-3 rounded-lg border-l-4 border-tertiary bg-surface hover:bg-surface-variant transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-1">
<span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-tertiary-container text-on-tertiary-container">Warning</span>
<span className="font-mono text-on-surface-variant text-[11px]">10:42 AM</span>
</div>
<p className="font-body-md text-on-surface font-medium">GPS drift detected</p>
<div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-on-surface-variant">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> Surat</span>
<span>#BK-2026-9942</span>
</div>
<div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-[12px] font-medium text-primary hover:underline">Monitor Live →</button>
</div>
</div>
</div>
<div className="p-3 border-t border-outline-variant bg-surface-container-low text-center">
<button className="font-label-md text-primary hover:text-primary-fixed-dim transition-colors">View All Logs</button>
</div>
</div>
</div>
</main>
