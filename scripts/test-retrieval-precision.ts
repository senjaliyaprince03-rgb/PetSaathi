import { retrieveRelevantChunks } from "../src/lib/ai/retriever";

const queries = [
  { q: "Why are Indian Pariah dogs and Indies ideal for apartment living in Pune?", src: "indian-dog-breeds" },
  { q: "Can a Persian cat survive the heat and humidity of Mumbai apartments?", src: "indian-cat-breeds" },
  { q: "What are the common traits of Rajapalayam and Mudhol Hound dogs in India?", src: "indian-dog-breeds" },
  { q: "What should I do if my Labrador puppy collapses from heatstroke in Ahmedabad afternoon?", src: "summer-heatstroke-management" },
  { q: "What time should I walk my Golden Retriever during peak summer in Delhi?", src: "summer-heatstroke-management" },
  { q: "How can I protect my dog paws from tar burns on Indian roads?", src: "summer-heatstroke-management" },
  { q: "What are the early symptoms of tick fever in Bangalore dogs during monsoon?", src: "tick-fever-season" },
  { q: "How do I prevent fungal infection and paw rot in monsoon puddles?", src: "monsoon-paw-care" },
  { q: "Which tick prevention is safest: spot-on, Bravecto or medicated collars?", src: "tick-flea-prevention-india" },
  { q: "Can my Bangalore apartment RWA legally ban pets from using the passenger lift?", src: "society-rwa-guidelines" },
  { q: "What should I do if community street dogs surround my leashed pet during morning walk?", src: "local-walk-safety" },
  { q: "What are the official Animal Welfare Board of India guidelines for apartment barking?", src: "society-rwa-guidelines" },
  { q: "Is it safe to give my Indie puppy buffalo milk, curd, and roti every day?", src: "nutrition-indian-context" },
  { q: "What is the complete puppy vaccination schedule for Rabies and DHPPiL in India?", src: "vaccination-schedule-india" },
  { q: "What should I immediately do if my dog eats rat poison or human paracetamol?", src: "common-emergencies-india" },
  { q: "When should I deworm my 8-week-old puppy and what can I feed him?", src: "puppy-care-first-three-months" },
  { q: "Why can't I take my 10-week-old puppy to the society garden lawn for walks?", src: "puppy-care-first-three-months" },
  { q: "How to stop my puppy from biting furniture during teething?", src: "puppy-care-first-three-months" },
  { q: "How do I help my 9-year-old Labrador walk on slippery marble apartment floors?", src: "senior-dog-care-india" },
  { q: "What joint supplements should I give to an aging German Shepherd with stiff hips?", src: "senior-dog-care-india" },
  { q: "How long should senior dog walks be during hot weather in Pune?", src: "senior-dog-care-india" },
  { q: "Are dogs allowed in Cubbon Park Bangalore and what are the timings?", src: "dog-friendly-parks-walk-routes-india" },
  { q: "Where can I walk my dog safely along Carter Road promenade in Mumbai?", src: "dog-friendly-parks-walk-routes-india" },
  { q: "Where are safe walking routes for dogs in Ahmedabad?", src: "dog-friendly-parks-walk-routes-india" },
  { q: "How does Bravecto work for tick prevention and how long does it last?", src: "tick-flea-prevention-india" },
  { q: "Why are permethrin spot-on tick treatments dangerous for cats in India?", src: "tick-flea-prevention-india" },
  { q: "How to clean society elevator pits and walls to prevent ticks in apartment buildings?", src: "tick-flea-prevention-india" },
  { q: "Mera kutta garmi mein khana nahi kha raha hai, kya karein?", src: "hindi-hinglish-pet-care-faq" },
  { q: "Puppy ko ulti aur dast ho rahe hain, kya ghar par Crocin ya Paracetamol de sakte hain?", src: "hindi-hinglish-pet-care-faq" },
  { q: "Society ke street dogs se pet ko kaise bachayein morning walk par?", src: "hindi-hinglish-pet-care-faq" },
];

async function check() {
  let hits = 0;
  for (const item of queries) {
    const chunks = await retrieveRelevantChunks(item.q, 3);
    const hit = chunks.some((c) => c.fileId === item.src);
    if (hit) hits++;
    else {
      console.log(`Miss on: "${item.q}" -> got: ${chunks.map(c => c.fileId).join(", ")} (expected ${item.src})`);
    }
  }
  const precision = (hits / queries.length) * 100;
  console.log(`\nRetrieval Precision@3: ${hits}/${queries.length} (${precision.toFixed(1)}%)`);
}

check();
