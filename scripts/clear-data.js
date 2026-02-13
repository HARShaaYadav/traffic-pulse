const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://hackathon:FFerYnkdJL8CxYqn@chats.n87ayvp.mongodb.net/?appName=chats';
const dbName = process.env.MONGODB_DB_NAME || 'traffic-pulse';

async function clearData() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db(dbName);
    
    // Collections to clear
    const collectionsToClear = [
      'traffic_snapshots',
      'alerts',
      'public_alerts',
      'incidents',
      'simulations',
      'intervention_history',
      'emergency_corridors',
      // 'signals' // Keep signals config? Maybe reset it.
    ];
    
    for (const colName of collectionsToClear) {
      try {
        const result = await db.collection(colName).deleteMany({});
        console.log(`✅ Cleared ${result.deletedCount} documents from '${colName}'`);
      } catch (e) {
        console.log(`⚠️  Could not clear '${colName}' (maybe it doesn't exist)`);
      }
    }

    // Reset signals to default overrides (empty)
    await db.collection('signals').deleteMany({ key: { $in: ['signal_override', 'signal_plan_log'] } });
    console.log(`✅ Reset signal overrides and logs`);
    
    console.log('🎉 All dummy/mock data cleared!');
    
  } catch (error) {
    console.error('❌ Clear failed:', error);
  } finally {
    await client.close();
  }
}

clearData();
