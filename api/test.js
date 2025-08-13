// /api/test.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("❌ MONGO_URI ortam değişkeni tanımlı değil!");
}

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("test"); // test DB
    const collections = await db.listCollections().toArray();

    res.status(200).json({
      message: "✅ MongoDB bağlantısı başarılı!",
      collections,
    });
  } catch (error) {
    console.error("❌ MongoDB Bağlantı Hatası:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
