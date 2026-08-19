import { MongoClient } from 'mongodb';
import { ingestDocument } from './ai/ingestion.mjs';

const docs = [
  {
    metadata: { documentId: "doc_platform_overview", source: "docs/overview.md" },
    text: "PetSaathi is India's premium pet care platform connecting pet parents with verified sitters and boarding facilities. We offer dog walking, pet sitting, grooming, and veterinary support."
  },
  {
    metadata: { documentId: "doc_safety_policy", source: "docs/policies/safety.md" },
    text: "Safety is our priority at PetSaathi. All sitters undergo mandatory background checks, ID verification, and first aid training. In case of emergency, our operations team is available 24/7."
  },
  {
    metadata: { documentId: "doc_pricing_faq", source: "docs/pricing.md" },
    text: "PetSaathi pricing varies by service. A 30-minute dog walk costs ₹250. Overnight boarding starts at ₹800 per night. Payments are processed securely via Razorpay. Refunds are available for cancellations made 24 hours prior to the booking."
  },
  {
    metadata: { documentId: "doc_onboarding", source: "docs/sops/onboarding.md" },
    text: "To become a PetSaathi partner, applicants must pass a practical assessment and complete training modules including Safety Basics. Once approved, partners can set their service radius and availability."
  }
];

async function seed() {
  process.env.VECTOR_STORE = "mongodb";
  const uri = process.env.MONGODB_URI || "mongodb://bhavnabensenjaliya6_db_user:XZCPuwDUHN9KF0rY@ac-vpfdzmw-shard-00-00.on80adu.mongodb.net:27017,ac-vpfdzmw-shard-00-01.on80adu.mongodb.net:27017,ac-vpfdzmw-shard-00-02.on80adu.mongodb.net:27017/petsaathi?authSource=admin&replicaSet=atlas-tg27k1-shard-0&ssl=true&retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB, dropping old collection...");
    const db = client.db('petsaathi');
    try {
      await db.collection('knowledge_chunks').drop();
      console.log("Dropped knowledge_chunks collection (and its bad index).");
    } catch(e) {
      console.log("Collection already dropped or doesn't exist.");
    }
  } finally {
    await client.close();
  }

  console.log("Starting ingestion...");
  for (const doc of docs) {
    const count = await ingestDocument(doc, { overwrite: true, maxChunkSize: 500 });
    console.log(`Ingested ${count} chunks for ${doc.metadata.documentId}`);
  }
  
  console.log("Done! RAG should now return results with correct dimensions.");
}

seed();
