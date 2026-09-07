import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface RetrievedChunk {
  fileId: string;
  title: string;
  category: string;
  cities: string[];
  tags: string[];
  content: string;
  score: number;
}

interface LoadedDoc {
  fileId: string;
  title: string;
  category: string;
  cities: string[];
  tags: string[];
  content: string;
  fullText: string;
}

let kbDocsCache: LoadedDoc[] | null = null;

function loadKnowledgeBase(): LoadedDoc[] {
  if (kbDocsCache) return kbDocsCache;

  const kbDir = path.resolve(process.cwd(), "content/pet-care-kb");
  if (!fs.existsSync(kbDir)) {
    console.warn("[KB Retriever] Warning: KB directory not found at " + kbDir);
    return [];
  }

  const files = fs.readdirSync(kbDir).filter((f: string) => f.endsWith(".md"));
  const docs: LoadedDoc[] = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(kbDir, file), "utf8");
      const parsed = matter(raw);
      const fileId = (parsed.data.id as string) || file.replace(/\.md$/, "");
      const title = (parsed.data.title as string) || fileId;
      const category = (parsed.data.category as string) || "general";
      const cities = Array.isArray(parsed.data.cities) ? parsed.data.cities.map((c: any) => String(c).toLowerCase()) : [];
      const parsedTags = Array.isArray(parsed.data.tags) ? parsed.data.tags.map((t: any) => String(t).toLowerCase()) : [];
      const tags = Array.from(new Set([...parsedTags, fileId, category]));
      const content = parsed.content.trim();
      const fullText = (title + " " + category + " " + fileId + " " + cities.join(" ") + " " + tags.join(" ") + " " + content).toLowerCase();

      docs.push({
        fileId,
        title,
        category,
        cities,
        tags,
        content,
        fullText
      });
    } catch (err: any) {
      console.error("[KB Retriever] Failed parsing " + file + ":", err.message);
    }
  }

  kbDocsCache = docs;
  return kbDocsCache;
}

/**
 * Retrieves the most relevant knowledge base chunks for an Indian pet care query.
 * Scoring:
 *  - Tag matches (city, breed, seasonal terms): +3 weight
 *  - Title matches: +2 weight
 *  - Keyword occurrences in body: +1 weight
 *
 * Always guarantees at least 1 fallback base chunk so context is never completely empty.
 */
export async function retrieveRelevantChunks(query: string, topK: number = 3): Promise<RetrievedChunk[]> {
  const docs = loadKnowledgeBase();
  if (docs.length === 0) return [];

  const rawTerms = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(t => t.length > 2);

  // Common stop words to exclude from weighting
  const stopWords = new Set(["the", "and", "for", "with", "this", "that", "from", "what", "how", "why", "when", "can", "should", "your", "have", "does"]);
  const searchTerms = rawTerms.filter(t => !stopWords.has(t));

  const scored: RetrievedChunk[] = docs.map(doc => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();

    for (const term of searchTerms) {
      // 1. Tag or City match: +3
      const tagMatch = doc.tags.some(tag => {
        const cleanTag = tag.replace(/-/g, " ");
        return cleanTag.includes(term) || tag.includes(term) || term.includes(tag);
      });
      const cityMatch = doc.cities.some(city => city.includes(term) || term.includes(city));
      if (tagMatch || cityMatch) {
        score += 3;
      }

      // 2. Title match: +2
      if (titleLower.includes(term)) {
        score += 2;
      }

      // 3. Body text match: +1 per term present
      if (doc.fullText.includes(term)) {
        score += 1;
      }
    }

    return {
      fileId: doc.fileId,
      title: doc.title,
      category: doc.category,
      cities: doc.cities,
      tags: doc.tags,
      content: doc.content,
      score
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const topResults = scored.slice(0, topK);

  // Safety net: ensure base chunk exists if all scores are 0
  if (topResults.length === 0 || topResults.every(r => r.score === 0)) {
    const defaultDoc = docs[0];
    if (!defaultDoc) return [];
    return [{
      fileId: defaultDoc.fileId,
      title: defaultDoc.title,
      category: defaultDoc.category,
      cities: defaultDoc.cities,
      tags: defaultDoc.tags,
      content: defaultDoc.content,
      score: 0
    }];
  }

  return topResults;
}
