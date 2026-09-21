<header className="h-20 w-full sticky top-0 z-40 bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm bg-surface dark:bg-inverse-surface flex justify-between items-center px-container_padding transition-transform">
{/* Mobile Brand (Visible only when side nav is hidden) */}
<div className="md:hidden flex items-center gap-stack_sm">
<h1 className="text-title-md font-title-md font-bold text-primary dark:text-primary-fixed">PetSaathi</h1>
</div>
{/* Page Title (Desktop) */}
<div className="hidden md:block">
{/* Keep empty for layout balance or use context */}
</div>
{/* Actions */}
<div className="flex items-center gap-gutter">
<button className="bg-primary hover:bg-primary-container text-on-primary text-body-lg font-body-lg px-6 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-low hidden sm:block">
                    Book Care Now
                </button>
<div className="flex items-center gap-stack_sm">
<button aria-label="Notification Bell" className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-full transition-all duration-200 hover:opacity-90 active:scale-95">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border-2 border-transparent hover:border-primary-container transition-all duration-200 hover:opacity-90 active:scale-95">
<img alt="Pooja Sharma" className="w-full h-full object-cover" data-alt="Portrait of Pooja Sharma, a young Indian woman smiling warmly, high quality photography, soft natural lighting, light mode UI context" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX7sZmPdFBlPF0BUjYas64rbs2h2YYjys5D3_YRcK4U6zJKUAXqs8Gs8-Zyjjl0PpTCtnnphAIM-fk6m2uSzfb0iF-WyVznH6l5jhRRk8uESE_IWdb3IMFVkRfoQEAdniUbLfE1y9Lo4Yqw83gbSNdL2tuZ15NZDWi4Lwa8_2IlFymFAYqPwPyqirDiPBrSoNkA-93MVYUnYVn0UIAdpdfwjhqgC9CZU83BRvg-RpyNv7yzarnDOabRA"/>
</button>
</div>
</div>
</header>