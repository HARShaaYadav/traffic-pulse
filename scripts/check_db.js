
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/traffic_cascade";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Check 'settings' collection
    const settings = await db.collection("settings").find().toArray();
    console.log("Settings Docs:", JSON.stringify(settings, null, 2));

    // Check 'keys' or 'secrets' if any
    for (const col of collections) {
        if (col.name.includes("key") || col.name.includes("secret")) {
             const docs = await db.collection(col.name).find().limit(5).toArray();
             console.log(`Docs in ${col.name}:`, docs);
        }
    }

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
