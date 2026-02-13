const { MongoClient } = require("mongodb");

async function testDelete() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to DB");
    const db = client.db("traffic-pulse"); // Default or should extract from URI? URI has /?appName=chats but no DB name in path.
    // .env.local doesn't specify DB name in URI, but code says `process.env.MONGODB_DB_NAME || 'traffic-pulse'`
    // So "traffic-pulse" is correct.

    const collection = db.collection("contacts");

    // Insert a dummy contact
    const dummyId = `test_contact_${Date.now()}`;
    await collection.insertOne({
      id: dummyId,
      name: "Test Delete",
      phone: "1234567890",
      role: "tester",
      createdAt: new Date(),
    });

    console.log(`Inserted dummy contact with id: ${dummyId}`);

    // Call API
    const url = `http://localhost:3000/api/contacts?id=${dummyId}`;
    console.log(`Calling DELETE ${url}`);
    
    // Use native fetch (Node 18+)
    const res = await fetch(url, {
      method: "DELETE",
    });

    if (res.ok) {
        console.log("API returned success");
    } else {
        console.error("API failed", res.status, await res.text());
    }

    // Verify if deleted
    const check = await collection.findOne({ id: dummyId });
    if (!check) {
      console.log("Contact successfully deleted from DB");
    } else {
      console.error("Contact still exists in DB!");
    }
    
    // Cleanup if it failed
    if (check) {
        await collection.deleteOne({ id: dummyId });
        console.log("Cleaned up dummy contact manually");
    }

  } catch (e) {
    console.error("Script error:", e);
  } finally {
    await client.close();
  }
}

testDelete();
