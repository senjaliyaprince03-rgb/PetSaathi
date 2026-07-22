const fs = require('fs');
let html = fs.readFileSync('temp_designs/premium_concierge/stitch_petsaathi_premium_pet_concierge/petsaathi_premium_pet_care_marketplace/code.html', 'utf8');
const bodyStart = html.indexOf('<div class="noise-bg');
const bodyEnd = html.indexOf('<script>');
let bodyHtml = html.substring(bodyStart, bodyEnd);

bodyHtml = bodyHtml.replace(/class=/g, 'className=');
bodyHtml = bodyHtml.replace(/for=/g, 'htmlFor=');
bodyHtml = bodyHtml.replace(/<!--(.*?)-->/g, '{/* $1 */}');
bodyHtml = bodyHtml.replace(/<br>/g, '<br />');
bodyHtml = bodyHtml.replace(/<hr>/g, '<hr />');
bodyHtml = bodyHtml.replace(/<img([^>]*[^/])>/g, '<img$1/>');
bodyHtml = bodyHtml.replace(/style="(.*?)"/g, (match, styleString) => {
    const styleObj = {};
    styleString.split(';').forEach(rule => {
        if (!rule.trim()) return;
        const [key, value] = rule.split(':');
        if (key && value) {
            const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
            styleObj[camelKey] = value.trim();
        }
    });
    return 'style={' + JSON.stringify(styleObj) + '}';
});

// Remove reveal-up classes to prevent invisible elements bug
bodyHtml = bodyHtml.replace(/reveal-up/g, '');
// Remove inline opacity attributes for reveal-up if any
bodyHtml = bodyHtml.replace(/opacity:\s*0;/g, '');

const tsxContent = `'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function MarketingExperience() {
  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('py-2', 'bg-surface/95');
          header.classList.remove('py-4', 'bg-surface/80');
        } else {
          header.classList.add('py-4', 'bg-surface/80');
          header.classList.remove('py-2', 'bg-surface/95');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      ${bodyHtml}
    </>
  );
}
`;

fs.writeFileSync('src/components/marketing/marketing-experience.tsx', tsxContent);
