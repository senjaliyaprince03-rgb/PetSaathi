<main className="flex-1 p-container_padding md:p-10 max-w-[1440px] mx-auto w-full">
{/* Page Header */}
<div className="mb-10">
<h2 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">Overview</h2>
<p className="text-body-lg font-body-lg text-on-surface-variant">Your pet care at a glance</p>
</div>
{/* Hero Section */}
<div className="bg-surface-container-low rounded-[24px] p-8 mb-10 shadow-low flex flex-col md:flex-row items-center justify-between gap-gutter relative overflow-hidden">
{/* Abstract BG pattern */}
<div className="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle at 100% 0%, #432662 0%, transparent 40%);"></div>
<div className="relative z-10">
<h3 className="text-display-lg font-display-lg text-primary mb-4">Hey Pooja 👋</h3>
<p className="text-title-md font-title-md text-on-surface">Ready to care for Bruno today?</p>
</div>
<div className="relative z-10 w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-surface shadow-high overflow-hidden shrink-0">
<img className="w-full h-full object-cover" data-alt="A happy Golden Retriever named Bruno looking directly at the camera, tongue out, sitting in a bright sunlit living room, modern high-end photography, warm ivory palette" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdTSKS6zPXFCcbVn_BEgVjI1fZqm5Y0BbYQyzWBZR3wdEc7zO6unISsycv2GmEYfD40GNUH_OlOOUS9LZPAcIARHCOfEivzTP9CSPbIDj2bqE1yXdrH_JMhl2MvQMI9DVspjrRa4QAya-KFOVMmoF-IrrkWz4Q6-x97uOnCbg9wh3H9QWRv2U0wEcfyfdQixytoC04SsLp9qh3yR_5_63EBq3KTgbD8jRnTp4Bqb_UwT5Tao9clGsUEw"/>
</div>
</div>
{/* Bento Grid Layout */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
{/* Active Booking Card (Span 8) */}
<div className="col-span-1 md:col-span-8 bg-surface-lowest rounded-[24px] p-6 shadow-low card-hover flex flex-col h-full bg-white">
<div className="flex justify-between items-start mb-6 border-b border-surface-container pb-4">
<div>
<span className="inline-flex items-center gap-1 text-label-caps font-label-caps uppercase text-secondary bg-secondary-fixed/50 px-2 py-1 rounded mb-2">
<span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                                Live Now
                            </span>
<h4 className="text-title-md font-title-md text-on-surface">Bruno Walking</h4>
<p className="text-body-sm font-body-sm text-on-surface-variant">4:00 PM - 5:00 PM</p>
</div>
<div className="text-right">
<span className="text-body-sm font-body-sm text-tertiary-container bg-tertiary-fixed-dim/30 px-3 py-1 rounded-full inline-flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]" data-icon="verified">verified</span>
                                Aarav Mehta
                            </span>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-1">K9 Trained Saathi</p>
</div>
</div>
<div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
{/* Live Map Placeholder */}
<div className="h-48 rounded-xl overflow-hidden shadow-inner relative bg-surface-variant" data-location="Mumbai" style="">
<div className="absolute inset-0 flex items-center justify-center flex-col text-on-surface-variant">
<span className="material-symbols-outlined text-[32px] mb-2" data-icon="location_on">location_on</span>
<span className="text-body-sm">Live GPS Tracking</span>
</div>
{/* Map texture overlay */}
<div className="absolute inset-0 opacity-20" style="background-image: repeating-linear-gradient(45deg, #432662 25%, transparent 25%, transparent 75%, #432662 75%, #432662), repeating-linear-gradient(45deg, #432662 25%, transparent 25%, transparent 75%, #432662 75%, #432662); background-position: 0 0, 10px 10px; background-size: 20px 20px;"></div>
</div>
{/* Live Stats */}
<div className="space-y-4">
<p className="text-body-lg font-body-lg text-primary-container font-semibold mb-2">Current Status: In Care</p>
<div className="grid grid-cols-2 gap-4">
<div className="bg-surface-container-low p-3 rounded-lg">
<p className="text-body-sm text-on-surface-variant mb-1">Duration</p>
<p className="text-title-md text-on-surface">22 min</p>
</div>
<div className="bg-surface-container-low p-3 rounded-lg">
<p className="text-body-sm text-on-surface-variant mb-1">Distance</p>
<p className="text-title-md text-on-surface">1.4 km</p>
</div>
<div className="bg-surface-container-low p-3 rounded-lg col-span-2 flex items-center justify-between">
<div>
<p className="text-body-sm text-on-surface-variant mb-1">Activity</p>
<p className="text-body-lg font-body-lg text-on-surface">2 potty breaks</p>
</div>
<span className="material-symbols-outlined text-secondary" data-icon="check_circle">check_circle</span>
</div>
</div>
</div>
</div>
</div>
{/* Quick Actions (Span 4) */}
<div className="col-span-1 md:col-span-4 grid grid-cols-2 gap-4 h-full">
<button className="bg-surface-container-low rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-low card-hover hover:bg-surface-container-high transition-colors">
<div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3">
<span className="material-symbols-outlined text-primary-container" data-icon="directions_walk">directions_walk</span>
</div>
<span className="text-body-lg font-body-lg text-on-surface font-semibold">Dog Walking</span>
</button>
<button className="bg-surface-container-low rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-low card-hover hover:bg-surface-container-high transition-colors">
<div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center mb-3">
<span className="material-symbols-outlined text-secondary" data-icon="home">home</span>
</div>
<span className="text-body-lg font-body-lg text-on-surface font-semibold">Pet Sitting</span>
</button>
<button className="bg-surface-container-low rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-low card-hover hover:bg-surface-container-high transition-colors">
<div className="w-12 h-12 rounded-full bg-tertiary-container/20 flex items-center justify-center mb-3">
<span className="material-symbols-outlined text-tertiary-container" data-icon="content_cut">content_cut</span>
</div>
<span className="text-body-lg font-body-lg text-on-surface font-semibold">Home Grooming</span>
</button>
<button className="bg-surface-container-low rounded-[24px] p-4 flex flex-col items-center justify-center text-center shadow-low card-hover hover:bg-surface-container-high transition-colors">
<div className="w-12 h-12 rounded-full bg-surface-tint/20 flex items-center justify-center mb-3">
<span className="material-symbols-outlined text-surface-tint" data-icon="local_hospital">local_hospital</span>
</div>
<span className="text-body-lg font-body-lg text-on-surface font-semibold">Vet On-Demand</span>
</button>
</div>
</div>
{/* Bottom Row Bento Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-gutter">
{/* Metrics Widget */}
<div className="bg-white rounded-[24px] p-6 shadow-low flex flex-col justify-between h-48 card-hover">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-primary" data-icon="moving">moving</span>
</div>
<h4 className="text-body-lg font-body-lg text-on-surface-variant">Activity Overview</h4>
</div>
<div className="mt-4">
<div className="flex justify-between items-end mb-2">
<span className="text-title-md font-title-md text-on-surface">1 Booking</span>
<span className="text-body-sm text-on-surface-variant">In Progress</span>
</div>
<div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
<div className="bg-primary h-2 rounded-full" style="width: 100%"></div>
</div>
</div>
</div>
{/* Pet Readiness Widget */}
<div className="bg-white rounded-[24px] p-6 shadow-low flex flex-col justify-between h-48 card-hover relative overflow-hidden">
<div className="flex items-center gap-3 z-10 relative">
<div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
<span className="material-symbols-outlined text-secondary" data-icon="favorite">favorite</span>
</div>
<h4 className="text-body-lg font-body-lg text-on-surface-variant">Pet Wellness</h4>
</div>
<div className="flex justify-between items-end z-10 relative mt-auto">
<div>
<p className="text-body-sm text-on-surface-variant mb-1">Bruno's Readiness</p>
<span className="text-display-lg font-display-lg text-on-surface leading-none">85<span className="text-title-md">%</span></span>
</div>
<span className="text-body-sm font-body-sm text-tertiary-container bg-tertiary-fixed-dim/30 px-3 py-1 rounded-full">
                            Active
                        </span>
</div>
{/* Decorative progress arc */}
<svg className="absolute bottom-[-20%] right-[-10%] w-32 h-32 text-secondary/10" viewbox="0 0 100 100">
<circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" stroke-dasharray="200" stroke-dashoffset="30" stroke-width="12"></circle>
</svg>
</div>
{/* Wallet & Passport Preview (Split or Combined depending on space, doing combined layered card here) */}
<div className="bg-primary text-on-primary rounded-[24px] p-6 shadow-low h-48 card-hover relative overflow-hidden flex flex-col justify-between">
{/* Abstract BG pattern for premium feel */}
<div className="absolute inset-0 opacity-20 pointer-events-none" style="background-image: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);"></div>
<div className="flex justify-between items-start relative z-10">
<div>
<h4 className="text-body-lg font-body-lg text-primary-fixed-dim mb-1">Wallet Balance</h4>
<p className="text-headline-lg font-headline-lg">₹1,250</p>
</div>
<button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
<span className="material-symbols-outlined text-white text-[20px]" data-icon="add">add</span>
</button>
</div>
<div className="mt-auto relative z-10 bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/20">
<div className="flex justify-between items-center mb-1">
<span className="text-body-sm font-semibold">Bruno (3y)</span>
<span className="text-[10px] uppercase tracking-wider bg-error/80 px-2 py-0.5 rounded text-white">Action</span>
</div>
<p className="text-body-sm text-primary-fixed-dim line-clamp-1">Healthy • Rabies due in 40 days</p>
</div>
</div>
</div>
</main>