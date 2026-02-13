require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require("mongodb");

async function checkDispatchLog() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("traffic-pulse");
    
    // Find the latest dispatch log
    const log = await db.collection("logs")
        .find({ type: "dispatch" })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

    if (log.length > 0) {
        console.log("✅ Dispatch Log Found:", JSON.stringify(log[0], null, 2));
    } else {
        console.log("❌ No dispatch logs found.");
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

checkDispatchLog();
