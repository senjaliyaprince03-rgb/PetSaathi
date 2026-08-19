import { MongoClient } from 'mongodb';

async function check() {
  const uri = process.env.MONGODB_URI || "mongodb://bhavnabensenjaliya6_db_user:XZCPuwDUHN9KF0rY@ac-vpfdzmw-shard-00-00.on80adu.mongodb.net:27017,ac-vpfdzmw-shard-00-01.on80adu.mongodb.net:27017,ac-vpfdzmw-shard-00-02.on80adu.mongodb.net:27017/petsaathi?authSource=admin&replicaSet=atlas-tg27k1-shard-0&ssl=true&retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db('petsaathi');
    const collection = db.collection('knowledge_chunks');

    const count = await collection.countDocuments();
    console.log(`knowledge_chunks count: ${count}`);

    if (count > 0) {
      const doc = await collection.findOne();
      console.log("Sample doc keys:", Object.keys(doc));
    }

    const indexes = await collection.listSearchIndexes().toArray();
    console.log("Search Indexes:", JSON.stringify(indexes, null, 2));

  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await client.close();
  }
}

check();
