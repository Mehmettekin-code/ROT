import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

export default async function handler(req, res) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("test"); // test adında bir db
    const collections = await db.listCollections().toArray();
    await client.close();

    res.status(200).json({
      message: "MongoDB bağlantısı başarılı 🎉",
      collections,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
