import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { credits } = await req.json();
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI || "");
    await client.connect();
    const db = client.db();
    const result = await db.collection("user").updateOne(
      { email: session.user.email },
      { $inc: { credits: Number(credits) } }
    );
    await client.close();
    return Response.json({ success: true, credits: Number(credits), modified: result.modifiedCount });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
