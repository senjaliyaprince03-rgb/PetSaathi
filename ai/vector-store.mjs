import { MongoClient } from 'mongodb';

/**
 * Vector Store Abstraction
 * Agnostic interface for vector databases.
 */
export class VectorStore {
  async addDocuments(documents) { throw new Error("Not implemented"); }
  async search(queryVector, options = {}) { throw new Error("Not implemented"); }
  async lexicalSearch(queryText, options = {}) { throw new Error("Not implemented"); }
  async deleteDocuments(filter) { throw new Error("Not implemented"); }
  async count() { throw new Error("Not implemented"); }
}

/**
 * Phase 5B Default Implementation
 * Validates the full RAG pipeline locally before adding external DB infrastructure.
 */
export class InMemoryVectorStore extends VectorStore {
  constructor() {
    super();
    this.store = [];
  }

  async addDocuments(documents) {
    for (const doc of documents) {
      this.store.push(doc);
    }
    return documents.length;
  }

  async lexicalSearch(queryText, options = {}) {
    // Basic mock implementation for in-memory lexical search
    const { topK = 50 } = options;
    const lowerQuery = queryText.toLowerCase();
    
    const results = this.store
      .map(doc => {
        let score = 0;
        if (doc.text.toLowerCase().includes(lowerQuery)) score = 1.0;
        return { ...doc, score };
      })
      .filter(doc => doc.score > 0)
      .slice(0, topK);
      
    return results;
  }

  async search(queryVector, options = {}) {
    const { topK = 50 } = options;

    function cosineSimilarity(vecA, vecB) {
      if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
      let dotProduct = 0;
      let normA = 0;
      let normB = 0;
      for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
      }
      return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    const results = this.store.map(doc => ({
      ...doc,
      score: cosineSimilarity(queryVector, doc.embedding)
    }));

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  async deleteDocuments(filter = {}) {
    let deletedCount = 0;
    
    if (Object.keys(filter).length === 0) {
      deletedCount = this.store.length;
      this.store = [];
    } else {
      const originalLength = this.store.length;
      this.store = this.store.filter(doc => {
        let match = true;
        for (const [key, value] of Object.entries(filter)) {
          if (doc.metadata[key] !== value) match = false;
        }
        return !match;
      });
      deletedCount = originalLength - this.store.length;
    }
    return deletedCount;
  }

  async count() {
    return this.store.length;
  }
}

/**
 * Phase 5C Production Implementation
 * Uses MongoDB Atlas Vector Search.
 */
export class MongoVectorStore extends VectorStore {
  constructor() {
    super();
    // Default to a local URI if env not set, though this is primarily for Atlas
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    this.client = new MongoClient(uri);
    this.dbName = process.env.MONGODB_DATABASE || 'petsaathi';
    this.collectionName = 'knowledge_chunks';
    this.indexName = 'vector_index';
  }

  async getCollection() {
    if (!this.connected) {
      await this.client.connect();
      this.connected = true;
    }
    return this.client.db(this.dbName).collection(this.collectionName);
  }

  async ensureCollection() {
    await this.getCollection();
    const db = this.client.db(this.dbName);
    const exists = await db.listCollections({ name: this.collectionName }).hasNext();

    if (!exists) {
      try {
        await db.createCollection(this.collectionName);
      } catch (error) {
        // Another worker may create it between the existence check and this request.
        if (error?.code !== 48) throw error;
      }
    }

    return db.collection(this.collectionName);
  }

  async ensureIndex(dimension) {
    const collection = await this.ensureCollection();
    try {
      // Create index if it doesn't exist
      // Using searchIndexes API for Atlas
      const indexes = await collection.listSearchIndexes().toArray();
      const existing = indexes.find(i => i.name === this.indexName);
      
      if (!existing) {
        await collection.createSearchIndex({
          name: this.indexName,
          type: "vectorSearch",
          definition: {
            fields: [
              {
                type: "vector",
                path: "embedding",
                numDimensions: dimension,
                similarity: "cosine"
              },
              {
                type: "filter",
                path: "metadata.documentId"
              }
            ]
          }
        });
        console.log(`[MongoVectorStore] Initiated creation of Atlas Vector Search index for dimension ${dimension}`);
      }
    } catch (e) {
      console.warn("[MongoVectorStore] Could not verify/create search index. Ensure you are running on MongoDB Atlas:", e.message);
    }
  }

  async addDocuments(documents) {
    if (documents.length === 0) return 0;
    
    // 1. Verify dimension and index
    const firstDoc = documents[0];
    if (!firstDoc.embedding || !Array.isArray(firstDoc.embedding)) {
      throw new Error("Missing or invalid embedding in document.");
    }
    const dimension = firstDoc.embedding.length;
    await this.ensureIndex(dimension);
    
    const collection = await this.getCollection();
    
    // 2. Insert mapped documents
    const ops = documents.map(doc => ({
      insertOne: {
        document: {
          documentId: doc.metadata?.documentId || 'doc',
          chunkIndex: doc.metadata?.chunkIndex || 0,
          text: doc.text,
          embedding: doc.embedding,
          metadata: doc.metadata || {},
          createdAt: new Date()
        }
      }
    }));
    
    const result = await collection.bulkWrite(ops);
    return result.insertedCount;
  }

  async search(queryVector, options = {}) {
    const { topK = 50 } = options;
    const collection = await this.getCollection();
    
    // Atlas Vector Search Pipeline
    const pipeline = [
      {
        $vectorSearch: {
          index: this.indexName,
          path: "embedding",
          queryVector: queryVector,
          numCandidates: Math.max(topK * 10, 100), // required by vectorSearch
          limit: topK
        }
      },
      {
        $project: {
          _id: 0,
          text: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    try {
      return await collection.aggregate(pipeline).toArray();
    } catch (e) {
      console.error("[MongoVectorStore] Vector search failed:", e.message);
      // Retrieval converts this into a safe, observable RAG_UNAVAILABLE_DB_OUTAGE response.
      throw new Error(`VECTOR_SEARCH_UNAVAILABLE: ${e.message}`);
    }
  }

  async lexicalSearch(queryText, options = {}) {
    const { topK = 50, filters = {} } = options;
    const collection = await this.getCollection();
    
    const searchIndexName = process.env.MONGODB_SEARCH_INDEX || 'knowledge_text';

    const pipeline = [
      {
        $search: {
          index: searchIndexName,
          text: {
            query: queryText,
            path: ["text", "metadata.documentId", "metadata.source"]
          }
        }
      },
      {
        $limit: topK
      },
      {
        $project: {
          _id: 0,
          text: 1,
          metadata: 1,
          score: { $meta: "searchScore" }
        }
      }
    ];

    try {
      return await collection.aggregate(pipeline).toArray();
    } catch (e) {
      console.error("[MongoVectorStore] Lexical search failed:", e.message);
      return [];
    }
  }

  async deleteDocuments(filter = {}) {
    const collection = await this.getCollection();
    if (Object.keys(filter).length === 0) {
      const count = await collection.countDocuments();
      await collection.deleteMany({});
      return count;
    } else {
      const mongoFilter = {};
      for (const [k, v] of Object.entries(filter)) {
        if (k === 'documentId') {
          mongoFilter.documentId = v;
        } else {
          mongoFilter[`metadata.${k}`] = v;
        }
      }
      const result = await collection.deleteMany(mongoFilter);
      return result.deletedCount;
    }
  }

  async count() {
    const collection = await this.getCollection();
    return await collection.countDocuments();
  }
}

// Export the singleton instance based on environment variable
export const vectorStore = process.env.VECTOR_STORE === 'mongodb' 
  ? new MongoVectorStore() 
  : new InMemoryVectorStore();
