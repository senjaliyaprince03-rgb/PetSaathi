<nav className="w-[250px] h-screen fixed left-0 top-0 border-r border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface flex flex-col py-stack_lg transition-all duration-200 ease-in-out z-50 hidden md:flex">
{/* Brand Header */}
<div className="px-gutter mb-stack_lg flex items-center gap-stack_sm">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-on-primary-container" data-icon="pets">pets</span>
</div>
<div>
<h1 className="text-title-md font-title-md font-bold text-primary dark:text-primary-fixed leading-tight">PetSaathi</h1>
<p className="text-body-sm font-body-sm text-on-surface-variant">Compassionate Care</p>
</div>
</div>
{/* Main Navigation */}
<div className="flex-1 overflow-y-auto px-base space-y-1">
{/* Active Tab */}
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-primary dark:text-primary-fixed border-l-4 border-primary dark:border-primary-fixed bg-surface-container-low dark:bg-surface-container-highest font-bold text-body-lg font-body-lg transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Overview</span>
</a>
{/* Inactive Tabs */}
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out border-l-4 border-transparent" href="#">
<span className="material-symbols-outlined" data-icon="pets">pets</span>
<span>My Pets</span>
</a>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out border-l-4 border-transparent" href="#">
<span className="material-symbols-outlined" data-icon="calendar_month">calendar_month</span>
<span>Book Care</span>
</a>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out border-l-4 border-transparent" href="#">
<span className="material-symbols-outlined" data-icon="medical_services">medical_services</span>
<span>Care Protocols</span>
</a>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out border-l-4 border-transparent" href="#">
<span className="material-symbols-outlined" data-icon="mail">mail</span>
<span>Protocol Inbox</span>
</a>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out border-l-4 border-transparent" href="#">
<span className="material-symbols-outlined" data-icon="grid_view">grid_view</span>
<span>Services Hub</span>
</a>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out border-l-4 border-transparent" href="#">
<span className="material-symbols-outlined" data-icon="military_tech">military_tech</span>
<span>Loyalty</span>
</a>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out border-l-4 border-transparent" href="#">
<span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span>Wallet</span>
</a>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out border-l-4 border-transparent" href="#">
<span className="material-symbols-outlined" data-icon="card_membership">card_membership</span>
<span>Subscriptions</span>
</a>
</div>
{/* Footer Actions */}
<div className="mt-auto px-base space-y-1 pt-stack_md">
<div className="px-stack_md py-2 mb-2">
<span className="inline-flex items-center gap-2 text-body-sm font-body-sm text-tertiary-container bg-tertiary-fixed-dim/30 px-3 py-1 rounded-full w-max">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    System Status: Online
                </span>
</div>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
<a className="flex items-center gap-stack_sm px-stack_md py-3 rounded-lg text-on-surface-variant dark:text-surface-variant hover:bg-surface-variant dark:hover:bg-on-surface-variant/10 text-body-lg font-body-lg transition-all duration-200 ease-in-out" href="#">
<span className="material-symbols-outlined" data-icon="help">help</span>
<span>Help</span>
</a>
</div>
</nav>