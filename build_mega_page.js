/* eslint-disable */
const fs = require('fs');
const { JSDOM } = require('jsdom');

const elevatedHtml = fs.readFileSync('temp_designs/elevated_luxury/stitch_petsaathi_elevated_luxury_pet_care/petsaathi_luxury_pet_care_platform_1/code.html', 'utf8');
const premiumHtml = fs.readFileSync('temp_designs/premium_concierge/stitch_petsaathi_premium_pet_concierge/petsaathi_premium_pet_care_marketplace/code.html', 'utf8');

const elevatedDom = new JSDOM(elevatedHtml);
const premiumDom = new JSDOM(premiumHtml);

const elevatedDoc = elevatedDom.window.document;
const premiumDoc = premiumDom.window.document;

// 1. Get header from premium
const header = premiumDoc.querySelector('header').outerHTML;

// 2. Get main from elevated
const mainSections = Array.from(elevatedDoc.querySelectorAll('main > section'));

// 3. Get premium sections
const premiumSections = Array.from(premiumDoc.querySelectorAll('main > section'));

// Let's identify the premium sections we want
const safetySection = premiumSections.find(s => s.innerHTML.includes('Uncompromising Safety Standards'));
const mapSection = premiumSections.find(s => s.innerHTML.includes('Serving Ahmedabad'));
const sitterCardsSection = premiumSections.find(s => s.innerHTML.includes('Top-rated Sitters'));
const ctaSection = premiumSections.find(s => s.innerHTML.includes('Your pet deserves trusted care'));

// Assemble the body
let finalBody = `
  <div class="noise-bg fixed inset-0 z-0"></div>
  ${header}
  <main class="relative z-10 pt-24">
`;

// Add Elevated Hero (Section 0)
if(mainSections[0]) finalBody += mainSections[0].outerHTML;
// Add Trust Strip (Section 1)
if(mainSections[1]) finalBody += mainSections[1].outerHTML;
// Add Services Bento (Section 2)
if(mainSections[2]) finalBody += mainSections[2].outerHTML;
// Add Experience Flow (Section 3)
if(mainSections[3]) finalBody += mainSections[3].outerHTML;
// Add Insights/Wellness (Section 4)
if(mainSections[4]) finalBody += mainSections[4].outerHTML;

// Add Sitter Spotlight (Premium)
if(sitterCardsSection) finalBody += sitterCardsSection.outerHTML;

// Add Sitter of Month (Elevated Section 5)
if(mainSections[5]) finalBody += mainSections[5].outerHTML;

// Add Map (Premium)
if(mapSection) finalBody += mapSection.outerHTML;

// Add Safety (Premium)
if(safetySection) finalBody += safetySection.outerHTML;

// Add App Download (Elevated Section 6)
if(mainSections[6]) finalBody += mainSections[6].outerHTML;

// Add FAQ (Elevated Section 7)
if(mainSections[7]) finalBody += mainSections[7].outerHTML;

// Add Newsletter (Elevated Section 8)
if(mainSections[8]) finalBody += mainSections[8].outerHTML;

// Add CTA (Premium)
if(ctaSection) finalBody += ctaSection.outerHTML;

finalBody += `</main>`;

// Add Footer (Premium)
const footer = premiumDoc.querySelector('footer');
if (footer) finalBody += footer.outerHTML;

// Add Mobile Nav (Premium)
const mobileNav = premiumDoc.querySelector('nav.fixed.bottom-0');
if (mobileNav) finalBody += mobileNav.outerHTML;


// Convert to JSX
const htmlToBaseJsx = (html) => {
    let jsx = html;
    
    // Replace custom logo path
    jsx = jsx.replace(/src="[^"]*petsaathi_premium_logo\/screen.png"/g, 'src="/images/petsaathi-logo.png"');
    
    // Convert attributes
    jsx = jsx.replace(/class=/g, 'className=');
    jsx = jsx.replace(/for=/g, 'htmlFor=');
    jsx = jsx.replace(/tabindex=/g, 'tabIndex=');
    jsx = jsx.replace(/viewBox=/g, 'viewBox=');
    jsx = jsx.replace(/fill-rule=/g, 'fillRule=');
    jsx = jsx.replace(/clip-rule=/g, 'clipRule=');
    jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
    jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
    jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
    
    // Self-closing tags
    jsx = jsx.replace(/<img([^>]*?)(?<!\/)>/g, '<img$1 />');
    jsx = jsx.replace(/<input([^>]*?)(?<!\/)>/g, '<input$1 />');
    jsx = jsx.replace(/<hr([^>]*?)(?<!\/)>/g, '<hr$1 />');
    jsx = jsx.replace(/<br([^>]*?)(?<!\/)>/g, '<br$1 />');

    // Remove comments
    jsx = jsx.replace(/<!--[\s\S]*?-->/g, '');

    // Convert styles
    jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
        const rules = p1.split(';').filter(r => r.trim().length > 0);
        let styleObjStr = rules.map(rule => {
            let [key, ...rest] = rule.split(':');
            let val = rest.join(':');
            if(!key || !val) return '';
            key = key.trim();
            val = val.trim();
            key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            // fix quotes for val
            val = val.replace(/'/g, "\\'");
            return `${key}: '${val}'`;
        }).filter(r => r.length > 0).join(', ');
        return `style={{${styleObjStr}}}`;
    });

    return jsx;
};

const finalJsx = htmlToBaseJsx(finalBody);

const componentWrapper = `
'use client';
import React, { useEffect } from 'react';

export function MarketingExperience() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('py-2');
          header.classList.remove('py-4');
        } else {
          header.classList.add('py-4');
          header.classList.remove('py-2');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    // Accordion Logic for FAQ
    const faqButtons = document.querySelectorAll('button[aria-expanded]');
    faqButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !isExpanded);
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.material-symbols-outlined');
        if (content) {
            content.classList.toggle('hidden');
        }
        if (icon) {
            icon.textContent = isExpanded ? 'add' : 'remove';
        }
      });
    });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      ${finalJsx}
    </>
  );
}
`;

fs.writeFileSync('src/components/marketing/marketing-experience.tsx', componentWrapper);
console.log('Successfully generated marketing-experience.tsx');
