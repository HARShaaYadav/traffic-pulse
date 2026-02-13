
const { MongoClient } = require("mongodb");
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local
const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.local')));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const uri = process.env.MONGODB_URI;
console.log("Connecting to:", uri ? "URI Found" : "No URI");

if (!uri) {
    console.error("MONGODB_URI missing in .env.local");
    process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected.");
    const dbName = process.env.MONGODB_DB_NAME || 'traffic-pulse';
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log(`Collections in ${dbName}:`, collections.map(c => c.name));

    // Check 'settings' collection
    const settings = await db.collection("settings").find().toArray();
    console.log("Settings Docs:", JSON.stringify(settings, null, 2));

    // Check 'users' collection
    const users = await db.collection("users").find().limit(2).toArray();
    console.log("Users Docs:", JSON.stringify(users, null, 2));
    
    // Check 'twitter_keys' or similar
    // Also scan all collections for any doc with 'twitter' field
    /*
    for (const col of collections) {
        const sample = await db.collection(col.name).findOne({});
        if (JSON.stringify(sample).toLowerCase().includes("twitter")) {
             console.log(`Found 'twitter' in ${col.name}:`, sample);
        }
    }
    */

  } catch(e) {
      console.error(e);
  } finally {
    await client.close();
  }
}
run();
