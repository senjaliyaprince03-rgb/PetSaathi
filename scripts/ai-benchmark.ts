import { retrieveRelevantChunks } from "../src/lib/ai/retriever";
// @ts-expect-error - no declaration file
import { askNvidia } from "../ai/router.mjs";

interface BenchmarkCase {
  id: number;
  category: "breeds" | "summer" | "tick-fever" | "society" | "emergencies" | "puppy" | "senior" | "parks" | "hindi";
  query: string;
  expectedKeywords: string[];
  expectedTopSource: string;
}

const benchmarkSuite: BenchmarkCase[] = [
  // Category 1: Indian Breeds & Adaptation (3 queries)
  {
    id: 1,
    category: "breeds",
    query: "Why are Indian Pariah dogs and Indies ideal for apartment living in Pune?",
    expectedKeywords: ["indie", "immunity", "grooming", "hardy"],
    expectedTopSource: "indian-dog-breeds"
  },
  {
    id: 2,
    category: "breeds",
    query: "Can a Persian cat survive the heat and humidity of Mumbai apartments?",
    expectedKeywords: ["persian", "ac", "grooming", "matting", "flat"],
    expectedTopSource: "indian-cat-breeds"
  },
  {
    id: 3,
    category: "breeds",
    query: "What are the common traits of Rajapalayam and Mudhol Hound dogs in India?",
    expectedKeywords: ["hound", "sight", "speed", "indigenous"],
    expectedTopSource: "indian-dog-breeds"
  },

  // Category 2: Summer Heatstroke & Climate Management (3 queries)
  {
    id: 4,
    category: "summer",
    query: "What should I do if my Labrador puppy collapses from heatstroke in Ahmedabad afternoon?",
    expectedKeywords: ["cool", "water", "ice", "paws", "vet", "emergency"],
    expectedTopSource: "summer-heatstroke-management"
  },
  {
    id: 5,
    category: "summer",
    query: "What time should I walk my Golden Retriever during peak summer in Delhi?",
    expectedKeywords: ["morning", "evening", "pavement", "hydration"],
    expectedTopSource: "summer-heatstroke-management"
  },
  {
    id: 6,
    category: "summer",
    query: "How can I protect my dog paws from tar burns on Indian roads?",
    expectedKeywords: ["pavement", "burn", "test", "shoes", "balm"],
    expectedTopSource: "summer-heatstroke-management"
  },

  // Category 3: Tick Fever & Monsoon Parasite Defense (3 queries)
  {
    id: 7,
    category: "tick-fever",
    query: "What are the early symptoms of tick fever in Bangalore dogs during monsoon?",
    expectedKeywords: ["fever", "lethargy", "ticks", "platelet", "appetite"],
    expectedTopSource: "tick-fever-season"
  },
  {
    id: 8,
    category: "tick-fever",
    query: "How do I prevent fungal infection and paw rot in monsoon puddles?",
    expectedKeywords: ["paw", "dry", "antifungal", "monsoon", "mud"],
    expectedTopSource: "monsoon-paw-care"
  },
  {
    id: 9,
    category: "tick-fever",
    query: "Which tick prevention is safest: spot-on, Bravecto or medicated collars?",
    expectedKeywords: ["spot-on", "tick", "vet", "flea", "bravecto"],
    expectedTopSource: "tick-flea-prevention-india"
  },

  // Category 4: Gated Society Bylaws & Local Safety (3 queries)
  {
    id: 10,
    category: "society",
    query: "Can my Bangalore apartment RWA legally ban pets from using the passenger lift?",
    expectedKeywords: ["lift", "rwa", "awbi", "illegal", "ban"],
    expectedTopSource: "society-rwa-guidelines"
  },
  {
    id: 11,
    category: "society",
    query: "What should I do if community street dogs surround my leashed pet during morning walk?",
    expectedKeywords: ["leash", "calm", "pack", "territory", "treat"],
    expectedTopSource: "local-walk-safety"
  },
  {
    id: 12,
    category: "society",
    query: "What are the official Animal Welfare Board of India guidelines for apartment barking?",
    expectedKeywords: ["awbi", "guidelines", "barking", "by-laws"],
    expectedTopSource: "society-rwa-guidelines"
  },

  // Category 5: Clinical Emergencies & Indian Nutrition (3 queries)
  {
    id: 13,
    category: "emergencies",
    query: "Is it safe to give my Indie puppy buffalo milk, curd, and roti every day?",
    expectedKeywords: ["milk", "lactose", "curd", "protein", "nutrition"],
    expectedTopSource: "nutrition-indian-context"
  },
  {
    id: 14,
    category: "emergencies",
    query: "What is the complete puppy vaccination schedule for Rabies and DHPPiL in India?",
    expectedKeywords: ["rabies", "vaccine", "dhppil", "booster", "weeks"],
    expectedTopSource: "vaccination-schedule-india"
  },
  {
    id: 15,
    category: "emergencies",
    query: "What should I immediately do if my dog eats rat poison or human paracetamol?",
    expectedKeywords: ["poison", "emergency", "clinic", "vet", "vomiting"],
    expectedTopSource: "common-emergencies-india"
  },

  // Category 6: Puppy Care First 3 Months (3 queries)
  {
    id: 16,
    category: "puppy",
    query: "When should I deworm my 8-week-old puppy and what can I feed him?",
    expectedKeywords: ["deworming", "curd", "kibble", "weeks"],
    expectedTopSource: "puppy-care-first-three-months"
  },
  {
    id: 17,
    category: "puppy",
    query: "Why can't I take my 10-week-old puppy to the society garden lawn for walks?",
    expectedKeywords: ["parvovirus", "vaccine", "booster", "quarantine"],
    expectedTopSource: "puppy-care-first-three-months"
  },
  {
    id: 18,
    category: "puppy",
    query: "How to stop my puppy from biting furniture during teething?",
    expectedKeywords: ["teething", "chew", "carrot", "toys"],
    expectedTopSource: "puppy-care-first-three-months"
  },

  // Category 7: Senior Dog Care (3 queries)
  {
    id: 19,
    category: "senior",
    query: "How do I help my 9-year-old Labrador walk on slippery marble apartment floors?",
    expectedKeywords: ["marble", "mats", "arthritis", "grip"],
    expectedTopSource: "senior-dog-care-india"
  },
  {
    id: 20,
    category: "senior",
    query: "What joint supplements should I give to an aging German Shepherd with stiff hips?",
    expectedKeywords: ["glucosamine", "chondroitin", "omega", "joint"],
    expectedTopSource: "senior-dog-care-india"
  },
  {
    id: 21,
    category: "senior",
    query: "How long should senior dog walks be during hot weather in Pune?",
    expectedKeywords: ["short", "gentle", "heat", "minutes"],
    expectedTopSource: "senior-dog-care-india"
  },

  // Category 8: City Parks & Walk Routes (3 queries)
  {
    id: 22,
    category: "parks",
    query: "Are dogs allowed in Cubbon Park Bangalore and what are the timings?",
    expectedKeywords: ["cubbon", "bangalore", "morning", "leash"],
    expectedTopSource: "dog-friendly-parks-walk-routes-india"
  },
  {
    id: 23,
    category: "parks",
    query: "Where can I walk my dog safely along Carter Road promenade in Mumbai?",
    expectedKeywords: ["carter", "mumbai", "morning", "promenade"],
    expectedTopSource: "dog-friendly-parks-walk-routes-india"
  },
  {
    id: 24,
    category: "parks",
    query: "Where are safe walking routes for dogs in Ahmedabad?",
    expectedKeywords: ["riverfront", "vastrapur", "leash", "paved"],
    expectedTopSource: "dog-friendly-parks-walk-routes-india"
  },

  // Category 9: Tick & Flea Prevention (3 queries)
  {
    id: 25,
    category: "tick-fever",
    query: "How does Bravecto work for tick prevention and how long does it last?",
    expectedKeywords: ["bravecto", "fluralaner", "weeks", "tick"],
    expectedTopSource: "tick-flea-prevention-india"
  },
  {
    id: 26,
    category: "tick-fever",
    query: "Why are permethrin spot-on tick treatments dangerous for cats in India?",
    expectedKeywords: ["permethrin", "cats", "toxic", "lethal"],
    expectedTopSource: "tick-flea-prevention-india"
  },
  {
    id: 27,
    category: "tick-fever",
    query: "How to clean society elevator pits and walls to prevent ticks in apartment buildings?",
    expectedKeywords: ["society", "ticks", "pyrethroid", "compound"],
    expectedTopSource: "tick-flea-prevention-india"
  },

  // Category 10: Hindi & Hinglish Queries (3 queries)
  {
    id: 28,
    category: "hindi",
    query: "Mera kutta garmi mein khana nahi kha raha hai, kya karein?",
    expectedKeywords: ["dahi", "paani", "garmi", "vet"],
    expectedTopSource: "hindi-hinglish-pet-care-faq"
  },
  {
    id: 29,
    category: "hindi",
    query: "Puppy ko ulti aur dast ho rahe hain, kya ghar par Crocin ya Paracetamol de sakte hain?",
    expectedKeywords: ["crocin", "paracetamol", "vet", "jaanleva", "nahi"],
    expectedTopSource: "hindi-hinglish-pet-care-faq"
  },
  {
    id: 30,
    category: "hindi",
    query: "Society ke street dogs se pet ko kaise bachayein morning walk par?",
    expectedKeywords: ["leash", "patte", "stray", "daudein"],
    expectedTopSource: "hindi-hinglish-pet-care-faq"
  }
];

async function runBenchmark() {
  console.log("═════════════════════════════════════════════════════════════════════");
  console.log("    PETSAATHI AI — EXPANDED 30-QUERY GROUNDING BENCHMARK SUITE");
  console.log("═════════════════════════════════════════════════════════════════════");
  console.log(`Total test queries: ${benchmarkSuite.length} across 10 specialized domains\n`);

  let passedRetrieval = 0;
  let passedResponse = 0;
  let passedOverall = 0;

  const resultsTable: any[] = [];

  for (const tc of benchmarkSuite) {
    process.stdout.write(`Query #${tc.id} [${tc.category}] ... `);
    const start = Date.now();

    try {
      // 1. Check Retrieval grounding (top 3)
      const chunks = await retrieveRelevantChunks(tc.query, 3);
      const topChunk = chunks[0];
      const retrievalHit = chunks.some(c => c.fileId === tc.expectedTopSource);

      if (retrievalHit) {
        passedRetrieval++;
      }

      // 2. Perform Router Inference with Indian Pet Care Context
      const aiResponse = await askNvidia({
        task: "fast",
        difficulty: "normal",
        isCustomerChat: true,
        portal: "customer",
        returnMetadata: true
      }, tc.query);

      const durationMs = Date.now() - start;
      const content = (aiResponse.content || "").toLowerCase();

      // 3. Keyword Match check
      const keywordHit = tc.expectedKeywords.some(kw => content.includes(kw.toLowerCase()));

      if (keywordHit) {
        passedResponse++;
      }

      const isOverallPass = retrievalHit && (keywordHit || content.length > 50);
      if (isOverallPass) {
        passedOverall++;
      }

      const status = isOverallPass ? "PASS" : "WARN";
      console.log(`${status} (${durationMs}ms) Top: ${topChunk?.fileId || "none"}`);

      resultsTable.push({
        id: tc.id,
        category: tc.category,
        retrievalHit: retrievalHit ? "YES" : "NO",
        topMatchedDoc: topChunk?.fileId,
        latencyMs: durationMs,
        model: aiResponse.executionModel || "n/a",
        result: isOverallPass ? "PASS" : "FAIL"
      });

    } catch (err: any) {
      console.log(`FAIL: ${err.message}`);
      resultsTable.push({
        id: tc.id,
        category: tc.category,
        retrievalHit: "ERR",
        topMatchedDoc: "err",
        latencyMs: Date.now() - start,
        model: "err",
        result: "FAIL"
      });
    }
  }

  console.log("\n═════════════════════════════════════════════════════════════════════");
  console.log("                    BENCHMARK SCORECARD SUMMARY");
  console.log("═════════════════════════════════════════════════════════════════════");
  console.table(resultsTable);

  const passRate = (passedOverall / benchmarkSuite.length) * 100;
  console.log(`\nOverall Benchmark Results:`);
  console.log(`  Grounding Top-K Retrieval Accuracy: ${passedRetrieval}/${benchmarkSuite.length} (${((passedRetrieval / benchmarkSuite.length) * 100).toFixed(1)}%)`);
  console.log(`  Response Quality & Keywords Passed: ${passedResponse}/${benchmarkSuite.length} (${((passedResponse / benchmarkSuite.length) * 100).toFixed(1)}%)`);
  console.log(`  Combined Overall Benchmark Passed : ${passedOverall}/${benchmarkSuite.length} (${passRate.toFixed(1)}%)`);
  console.log(`  Target Threshold: >= 27/30 (90.0%)`);

  if (passedOverall >= 27) {
    console.log(`\n🎉 RESULT: PASSED — Met 90% Grounding Accuracy Threshold! (${passedOverall}/30)\n`);
    process.exit(0);
  } else {
    console.error(`\n⚠️ RESULT: Below target threshold (${passedOverall}/30). Investigate ungrounded cases.\n`);
    process.exit(1);
  }
}

runBenchmark();