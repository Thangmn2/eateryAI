import { MongoClient } from 'mongodb'

let mongoClient
let mongoDb

export async function getMongoDb() {
  const uri = process.env.MONGODB_URI?.trim()
  const dbName = process.env.MONGODB_DB?.trim()

  if (!uri || !dbName) {
    const error = new Error(
      'MongoDB is not configured. Set MONGODB_URI and MONGODB_DB in the environment.'
    )
    error.statusCode = 500
    throw error
  }

  if (mongoDb) {
    return mongoDb
  }

  mongoClient = new MongoClient(uri, {
    maxPoolSize: 10,
  })

  await mongoClient.connect()
  mongoDb = mongoClient.db(dbName)
  return mongoDb
}
