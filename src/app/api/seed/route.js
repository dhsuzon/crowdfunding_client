import { MongoClient } from "mongodb";
import { scryptSync, randomBytes } from "crypto";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64, { N: 16384, r: 16, p: 1 }).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function GET() { return POST(); }

export async function POST() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI || "");
    await client.connect();
    const db = client.db();

    const existing = await db.collection("user").findOne({ email: "admin@gmail.com" });
    if (existing) {
      await client.close();
      return Response.json({ message: "Admin user already exists", userId: existing._id.toString() });
    }

    const hashedPassword = hashPassword("admin12345");
    const now = new Date();

    const userResult = await db.collection("user").insertOne({
      name: "Admin",
      email: "admin@gmail.com",
      emailVerified: true,
      image: "",
      role: "admin",
      credits: 100000,
      totalRaisedCredits: 0,
      photoURL: "",
      createdAt: now,
      updatedAt: now,
    });

    await db.collection("account").insertOne({
      userId: userResult.insertedId.toString(),
      accountId: "admin@gmail.com",
      providerId: "email",
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });

    await client.close();
    return Response.json({ message: "Admin user created", userId: userResult.insertedId.toString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
