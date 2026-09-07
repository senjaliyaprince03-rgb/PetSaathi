$css = \"
@layer utilities {
    .shadow-low {
        box-shadow: 0 4px 12px rgba(38, 22, 38, 0.04);
    }
    .shadow-high {
        box-shadow: 0 12px 24px rgba(38, 22, 38, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
    }
    .card-hover {
        @apply transition-all duration-300 ease-in-out hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(38,22,38,0.06)];
    }
}
\"
Add-Content -Path src/app/globals.css -Value $css
