// Seed script to create default admin user
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || 'mongodb+srv://hackathon:FFerYnkdJL8CxYqn@chats.n87ayvp.mongodb.net/?appName=chats';
const dbName = process.env.MONGODB_DB_NAME || 'traffic-pulse';

async function seed() {
  console.log('Connecting to MongoDB...');
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db(dbName);
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existing = await usersCollection.findOne({ email: 'admin@traffic.com' });
    if (existing) {
      console.log('Admin user already exists, deleting and re-creating...');
      await usersCollection.deleteOne({ email: 'admin@traffic.com' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin user
    await usersCollection.insertOne({
      id: 'user_admin',
      email: 'admin@traffic.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });
    
    console.log('✅ Admin user seeded successfully!');
    console.log('   Email:    admin@traffic.com');
    console.log('   Password: admin123');
    console.log('   Role:     admin');
    
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await client.close();
  }
}

seed();
