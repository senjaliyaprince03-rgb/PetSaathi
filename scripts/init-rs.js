/* eslint-disable @typescript-eslint/no-require-imports */
const { MongoClient } = require('mongodb');

async function initiateReplicaSet() {
  const url = 'mongodb://127.0.0.1:27018';
  const client = new MongoClient(url, { directConnection: true });

  try {
    await client.connect();
    console.log("Connected directly to mongod");

    const db = client.db('admin');
    const result = await db.command({ replSetInitiate: {
      _id: "rs0",
      members: [{ _id: 0, host: "127.0.0.1:27018" }]
    }});
    console.log("Replica set initiated:", result);
  } catch (error) {
    if (error.codeName === 'AlreadyInitialized') {
      console.log("Replica set is already initialized.");
    } else {
      console.error("Failed to initiate replica set:", error);
    }
  } finally {
    await client.close();
  }
}

initiateReplicaSet();
