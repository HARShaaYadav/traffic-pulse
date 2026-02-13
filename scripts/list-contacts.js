const { MongoClient } = require("mongodb");

async function listContacts() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI not found");
    return;
  }
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("traffic-pulse");
    const contacts = await db.collection("contacts").find().toArray();
    console.log("Contacts in DB:", JSON.stringify(contacts, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

listContacts();
