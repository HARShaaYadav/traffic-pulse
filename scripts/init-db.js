const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const uri = 'mongodb://localhost:27017'
const dbName = 'traffic-pulse'

async function initDatabase() {
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    console.log('Connected to MongoDB')
    
    const db = client.db(dbName)
    
    // Create users collection with demo admin
    const usersCollection = db.collection('users')
    const existingAdmin = await usersCollection.findOne({ email: 'admin@traffic.com' })
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await usersCollection.insertOne({
        id: 'user_admin',
        email: 'admin@traffic.com',
        name: 'Admin User',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
      })
      console.log('✅ Demo admin user created: admin@traffic.com / admin123')
    } else {
      console.log('✅ Demo admin user already exists')
    }
    
    // Create indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await usersCollection.createIndex({ id: 1 }, { unique: true })
    
    const trafficCollection = db.collection('traffic_data')
    await trafficCollection.createIndex({ timestamp: -1 })
    
    const simulationsCollection = db.collection('simulations')
    await simulationsCollection.createIndex({ timestamp: -1 })
    
    const incidentsCollection = db.collection('incidents')
    await incidentsCollection.createIndex({ timestamp: -1 })
    await incidentsCollection.createIndex({ status: 1 })
    
    console.log('✅ Database indexes created')
    console.log('✅ Database initialization complete!')
    
  } catch (error) {
    console.error('❌ Database initialization error:', error)
  } finally {
    await client.close()
  }
}

initDatabase()
