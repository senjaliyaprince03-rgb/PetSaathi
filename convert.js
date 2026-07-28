/* eslint-disable */
const fs = require('fs');

const htmlToBaseJsx = (html) => {
    let jsx = html;
    
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
    
    // Close self-closing tags (basic heuristic)
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
            // camelCase
            key = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            return `${key}: '${val}'`;
        }).filter(r => r.length > 0).join(', ');
        return `style={{${styleObjStr}}}`;
    });

    return jsx;
};

// 1. Elevated Luxury (Base)
const elevatedHtml = fs.readFileSync('temp_designs/elevated_luxury/stitch_petsaathi_elevated_luxury_pet_care/petsaathi_luxury_pet_care_platform_1/code.html', 'utf8');
const elevatedBodyMatch = elevatedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let elevatedBody = elevatedBodyMatch ? elevatedBodyMatch[1] : '';
elevatedBody = elevatedBody.replace(/<script[\s\S]*?<\/script>/g, '');
const elevatedJsx = htmlToBaseJsx(elevatedBody);

// 2. Premium Concierge (Source of Sitter Cards, Map, CTA, Footer)
const premiumHtml = fs.readFileSync('temp_designs/premium_concierge/stitch_petsaathi_premium_pet_concierge/petsaathi_premium_pet_care_marketplace/code.html', 'utf8');
const premiumBodyMatch = premiumHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/);
let premiumBody = premiumBodyMatch ? premiumBodyMatch[1] : '';
const premiumJsx = htmlToBaseJsx(premiumBody);

fs.writeFileSync('elevated_jsx.txt', elevatedJsx);
fs.writeFileSync('premium_jsx.txt', premiumJsx);
console.log("Extracted JSX to txt files");
