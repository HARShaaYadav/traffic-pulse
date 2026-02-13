import { MongoClient } from "mongodb";

const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/traffic_cascade";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name),
    );

    const settings = await db.collection("settings").find().toArray();
    console.log("Settings Docs:", JSON.stringify(settings, null, 2));

    // Check for any other likely collection
    // const keys = await db.collection("keys").find().toArray();
    // console.log("Keys Docs:", keys);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
