
<!-- SideNavBar -->
<nav className="bg-surface-container-lowest dark:bg-surface-container-low w-[260px] h-screen fixed left-0 top-0 border-r border-on-surface/10 hidden md:flex flex-col h-full py-6 z-50">
<div className="px-6 mb-8">
<h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed">PetSaathi</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Verified Pet Care</p>
</div>
<div className="flex-grow overflow-y-auto">
<ul className="space-y-1">
<li>
<a className="flex items-center gap-3 px-4 py-3 text-primary dark:text-primary-fixed-dim bg-primary/5 border-l-4 border-primary hover:bg-on-surface/5 transition-colors opacity-80 duration-200" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>dashboard</span>
<span className="font-body-md text-body-md">Overview</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant border-l-4 border-transparent hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>pets</span>
<span className="font-body-md text-body-md">My Pets</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant border-l-4 border-transparent hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>add_circle</span>
<span className="font-body-md text-body-md">Book Care</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant border-l-4 border-transparent hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>description</span>
<span className="font-body-md text-body-md">Care Protocols</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant border-l-4 border-transparent hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>move_to_inbox</span>
<span className="font-body-md text-body-md">Protocol Inbox</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant border-l-4 border-transparent hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>hub</span>
<span className="font-body-md text-body-md">Services Hub</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant border-l-4 border-transparent hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>workspace_premium</span>
<span className="font-body-md text-body-md">Loyalty &amp; Rewards</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant border-l-4 border-transparent hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_balance_wallet</span>
<span className="font-body-md text-body-md">Service Wallet</span>
</a>
</li>
<li>
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant border-l-4 border-transparent hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>card_membership</span>
<span className="font-body-md text-body-md">Subscriptions</span>
</a>
</li>
</ul>
</div>
<div className="mt-auto pt-4 border-t border-on-surface/10 px-4">
<a className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-on-surface-variant hover:bg-on-surface/5 transition-colors" href="#">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>help_outline</span>
<span className="font-body-md text-body-md">Help &amp; Support</span>
</a>
</div>
</nav>
<!-- Main Content Area -->
<main className="w-full md:ml-[260px] min-h-screen pb-20 md:pb-0">
<!-- TopAppBar -->
<header className="bg-surface dark:bg-surface-dim h-20 w-full sticky top-0 z-40 border-b border-on-surface/10 flex justify-between items-center px-6 md:px-10">
<div className="flex items-center gap-4">
<h2 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed md:hidden">PetSaathi</h2>
</div>
<div className="flex items-center gap-4">
<button className="text-secondary dark:text-secondary-fixed-dim font-headline-md text-headline-md hover:bg-on-surface/5 transition-colors p-2 rounded-full hidden sm:block">
                    + Book Care Now
                </button>
<button className="text-on-surface-variant dark:text-on-surface-variant hover:bg-on-surface/5 transition-colors p-2 rounded-full relative">
<span className="material-symbols-outlined">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
</button>
<div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border 2px border-surface-container-lowest">
<img alt="Pooja Sharma" className="w-full h-full object-cover" data-alt="Professional headshot of an Indian woman, smiling gently, brightly lit in a modern office setting. High key lighting, warm tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbYNnLb7Rn8F51VHObcbOiDoItbt7DTEDWqxwb9RsSI1Xs14k6cm7WFrFbhvRkqLCop9Yw-kR1BGVvemSVayI8t1k9e_ThW2PYTg8qvj2oGB2DWTuR91ae5baf3wbc23TYyWo3tfvqPJGkju8egLXCw8Uq-5t8WV6DqpJQ92B86gXl8L797VsD23I8Y5sJarha36C2x-JjZ8Fz6w5VcDRHbDuzwP_7TwWn5de4pRBY0KyA2ECj-7Th"/>
</div>
</div>
</header>
<div className="max-w-[container-max] mx-auto p-margin-mobile md:p-margin-desktop">
<!-- Page Header -->
<div className="mb-10">
<h1 className="font-display-lg text-display-lg text-on-surface hidden md:block">Overview</h1>
<p className="font-title-lg text-title-lg text-on-surface-variant mt-2 hidden md:block">Your pet care at a glance</p>
<div className="mt-6 p-6 rounded-xl bg-surface-container-lowest border border-on-surface/10 card-shadow flex flex-col md:flex-row items-center gap-6">
<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-primary text-3xl">waving_hand</span>
</div>
<div>
<h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Hey Pooja 👋 Ready to care for Bruno today?</h2>
</div>
</div>
</div>
<!-- Quick Actions Grid -->
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
<button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-xl border border-on-surface/10 card-shadow hover:bg-surface-container-low transition-colors group">
<span className="material-symbols-outlined text-primary mb-3 text-3xl group-hover:scale-110 transition-transform">directions_walk</span>
<span className="font-title-lg text-title-lg text-on-surface">Dog Walking</span>
</button>
<button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-xl border border-on-surface/10 card-shadow hover:bg-surface-container-low transition-colors group">
<span className="material-symbols-outlined text-primary mb-3 text-3xl group-hover:scale-110 transition-transform">chair</span>
<span className="font-title-lg text-title-lg text-on-surface">Pet Sitting</span>
</button>
<button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-xl border border-on-surface/10 card-shadow hover:bg-surface-container-low transition-colors group">
<span className="material-symbols-outlined text-primary mb-3 text-3xl group-hover:scale-110 transition-transform">content_cut</span>
<span className="font-title-lg text-title-lg text-on-surface">Home Grooming</span>
</button>
<button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest rounded-xl border border-on-surface/10 card-shadow hover:bg-surface-container-low transition-colors group">
<span className="material-symbols-outlined text-primary mb-3 text-3xl group-hover:scale-110 transition-transform">local_hospital</span>
<span className="font-title-lg text-title-lg text-on-surface">Vet On-Demand</span>
</button>
</div>
<!-- Bento Grid Main Content -->
<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
<!-- Large Active Booking Card (Span 8) -->
<div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-6 border border-on-surface/10 card-shadow">
<div className="flex justify-between items-start mb-6">
<div>
<span className="inline-flex items-center gap-1 bg-[#ff7d5e]/15 text-[#a53b22] font-label-md text-label-md px-2 py-1 rounded-full mb-3 uppercase">
<span className="w-2 h-2 rounded-full bg-[#a53b22] animate-pulse"></span>
                                Live GPS
                            </span>
<h3 className="font-headline-md text-headline-md text-on-surface">Bruno's afternoon walk</h3>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Today, 4:00 PM - 5:00 PM</p>
</div>
<div className="text-right">
<span className="font-title-lg text-title-lg text-on-surface block">1 Booking</span>
<span className="font-body-md text-body-md text-on-surface-variant">in Progress</span>
</div>
</div>
<div className="bg-surface-container-low rounded-lg p-4 mb-6 flex items-center gap-4 border border-on-surface/5">
<div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden border 2px border-surface-container-lowest">
<img alt="Aarav Mehta" className="w-full h-full object-cover" data-alt="Headshot of a friendly Indian man in his late 20s, wearing a casual polo shirt. Professional, bright outdoor lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLFZADlLjPcVmTpZtbGLyCi9K9Npd4De7v3DyYzHXG6E0DkUd1AdQVQPw-2FSv2b4l_8fKmC7KbFwxf_I5JJ7hgtOxsHNDP71EkBC9WZozZFYgQW0o_YgP0rojXembfe9LfI8rdGa2StkM_jyHbvKS9H1URNyF0WVyM4eDvjxbuR2wjoQQfW5M_QB8bSITfRiMoBClXMxVMVU6ya9gD924h5przxjoEg-8fXp_u2LniDcw3n88urRQ"/>
</div>
<div>
<p className="font-title-lg text-title-lg text-on-surface flex items-center gap-2">
                                Aarav Mehta 
                                <span className="inline-flex items-center gap-1 bg-[#16553f]/15 text-[#16553f] font-label-md text-label-md px-2 py-0.5 rounded-full uppercase">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Verified
                                </span>
</p>
<p className="font-body-md text-body-md text-on-surface-variant">Assigned Saathi • K9 Trained</p>
</div>
</div>
<div className="h-48 bg-surface-variant rounded-lg border border-on-surface/10 overflow-hidden relative" data-location="Mumbai" style="">
<!-- Simulated Map Area -->
<img alt="Map" className="w-full h-full object-cover opacity-80" data-alt="A stylized, light-themed map visualization showing a winding path in a neighborhood park in Mumbai. Soft pastel colors, minimal details, UI style map." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAocM7SkvQqcWsmhd7ESeLRQZGA-A_dI7-wqtw7CTKWK-dOPmi7RpeFcVleX5e8J_kllt5gN-34Bj8-qnGAuraAygD7mjhIDdfw5w3kYcpt1J3xRa0Ug_fTIMFLFYfIwDC6ZuZDg8-Q-BDgunuon2HjpvGcdMM8e00uqkkMN1ocYuI2WIetQsOFu4-wP4jfGVkWqhyKqXJ9VZ8vtMLvtN_C2rm8SJR9wtg7z4IkyrlGmcgmX1ZJNdrs"/>
<div className="absolute inset-0 flex items-center justify-center">
<div className="bg-surface-container-lowest px-4 py-2 rounded-full shadow-md border border-on-surface/10 flex items-center gap-2">
<span className="material-symbols-outlined text-secondary">location_on</span>
<span className="font-title-lg text-title-lg text-on-surface">In Care</span>
</div>
</div>
</div>
</div>
<!-- Right Column (Span 4) -->
<div className="md:col-span-4 flex flex-col gap-gutter">
<!-- Pet Passport Preview -->
<div className="bg-surface-container-lowest rounded-xl p-6 border border-on-surface/10 card-shadow">
<div className="flex justify-between items-start mb-4">
<h3 className="font-title-lg text-title-lg text-on-surface">Digital Pet Passport</h3>
<span className="font-body-md text-body-md text-on-surface-variant">1 Pet Active</span>
</div>
<div className="flex items-center gap-4 mb-6">
<div className="w-16 h-16 rounded-full bg-surface-variant overflow-hidden border-2 border-surface-container-lowest shadow-sm">
<img alt="Bruno" className="w-full h-full object-cover" data-alt="Close up portrait of a happy Golden Retriever dog looking directly at the camera. Soft, natural lighting, blurred background, high quality photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCofvBqQx9Fix5lndpv24_15uUd8va3hpoB4j0faCANfe18B3e80T8JZhFl_SASKNu_Ghz7coPxdvXa8dNUNm1Dmck7GbEX1CJDWfpgSHzR2Aemzos2Wb8o9PZxnMwPLCwFyzta6aPsnxELmn0Ye5IJMKTyxfvAqhi9M1X7oQtMi7_z8UAs4ANWXHU9tOJzxjtY1JWjkN8dPMat58IVbsiK19n6zHHReqILopg9X6h2sohw1ae1_k6P"/>
</div>
<div>
<h4 className="font-headline-md text-headline-md text-on-surface">Bruno</h4>
<p className="font-body-md text-body-md text-on-surface-variant">Golden Retriever • 3 years</p>
</div>
</div>
<div className="space-y-4">
<div>
<div className="flex justify-between text-body-md font-body-md mb-1">
<span className="text-on-surface-variant">Readiness Score</span>
<span className="text-[#16553f] font-semibold">85%</span>
</div>
<div className="w-full bg-surface-container-high rounded-full h-2">
<div className="bg-[#16553f] h-2 rounded-full" style={{ width: '85%' }}></div>
</div>
</div>
<div className="p-3 bg-[#ffdad6]/30 border border-[#ffdad6] rounded-lg flex items-start gap-3">
<span className="material-symbols-outlined text-error">warning</span>
<div>
<p className="font-title-lg text-title-lg text-on-surface">Rabies due in 40 days</p>
<p className="font-body-md text-body-md text-on-surface-variant text-sm">Schedule vet visit soon to maintain 100% readiness.</p>
</div>
</div>
</div>
<button className="w-full mt-4 py-2 text-primary font-title-lg text-title-lg border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors">View Full Passport</button>
</div>
<!-- Care Wallet -->
<div className="bg-surface-container-lowest rounded-xl p-6 border border-on-surface/10 card-shadow flex-grow flex flex-col justify-between">
<div>
<div className="flex items-center gap-2 mb-2 text-on-surface-variant">
<span className="material-symbols-outlined">account_balance_wallet</span>
<h3 className="font-title-lg text-title-lg">Care Wallet</h3>
</div>
<p className="font-display-lg text-display-lg text-on-surface">₹1,250</p>
<p className="font-body-md text-body-md text-[#16553f] mt-1 flex items-center gap-1">
<span className="material-symbols-outlined text-sm">trending_up</span> Available Balance
                            </p>
</div>
<div className="mt-6 flex gap-2">
<button className="flex-1 py-2 bg-primary text-on-primary rounded-lg font-title-lg text-title-lg hover:bg-primary/90 transition-colors">Add Funds</button>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Mobile Bottom Navigation (Visible only on md:hidden) -->
<nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-on-surface/10 flex justify-around items-center h-16 z-50 px-2 pb-safe">
<a className="flex flex-col items-center justify-center w-full h-full text-primary" href="#">
<div className="bg-primary/10 px-4 py-1 rounded-full mb-1">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
</div>
<span className="font-label-md text-label-md">Overview</span>
</a>
<a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors" href="#">
<span className="material-symbols-outlined mb-1">pets</span>
<span className="font-label-md text-label-md">My Pets</span>
</a>
<a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors" href="#">
<span className="material-symbols-outlined mb-1">add_circle</span>
<span className="font-label-md text-label-md">Book Care</span>
</a>
<a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors" href="#">
<span className="material-symbols-outlined mb-1">description</span>
<span className="font-label-md text-label-md">Protocols</span>
</a>
<a className="flex flex-col items-center justify-center w-full h-full text-on-surface-variant hover:text-on-surface transition-colors" href="#">
<span className="material-symbols-outlined mb-1">menu</span>
<span className="font-label-md text-label-md">Menu</span>
</a>
</nav>
