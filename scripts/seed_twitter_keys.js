
const { MongoClient } = require("mongodb");
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local for DB connection
const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, '../.env.local')));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const dbName = process.env.MONGODB_DB_NAME || 'traffic-pulse';
    const db = client.db(dbName);
    
    const keys = {
        key: "twitter_config",
        consumerKey: "UBXuEaQX4tGV2PZBd8SfGvbbl",
        consumerSecret: "6LX0niDdw9lEyhtIrb5uReOp3i1S6Aelj6GlMbuHX79ltKHU18",
        bearerToken: "AAAAAAAAAAAAAAAAAAAAAI9L7gEAAAAAs%2BaOMVve7B4k3Ih5dKJlKC3htHc%3DXGnGuhwYEDTHkXkamOJrbW7CUoFeZems3RbpTRIIOAj8dA4p35",
        updatedAt: new Date()
    };

    const result = await db.collection("settings").updateOne(
        { key: "twitter_config" },
        { $set: keys },
        { upsert: true }
    );

    console.log("Seeding complete.", result);

  } finally {
    await client.close();
  }
}
run().catch(console.dir);
