import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const PACKAGES = {
  50: { credits: 50, price: 6 },
  100: { credits: 100, price: 10 },
  300: { credits: 300, price: 25 },
  500: { credits: 500, price: 40 },
  800: { credits: 800, price: 60 },
  1500: { credits: 1500, price: 110 },
  2000: { credits: 2000, price: 140 },
};

export async function POST(req) {
  try {
    const userSession = await auth.api.getSession({ headers: await headers() });
    if (!userSession) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { sessionId, credits } = await req.json();
    const pkg = PACKAGES[credits];
    if (!pkg) {
      return Response.json({ error: "Invalid package" }, { status: 400 });
    }

    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (checkoutSession.payment_status !== "paid") {
      return Response.json({ error: "Payment not completed" }, { status: 400 });
    }

    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(process.env.MONGODB_URI || "");
    await client.connect();
    const db = client.db("crowdfundingDatabase");

    await db.collection("user").updateOne(
      { email: userSession.user.email },
      { $inc: { credits: pkg.credits } }
    );

    await db.collection("payments").insertOne({
      userEmail: userSession.user.email,
      userName: userSession.user.name,
      amount: pkg.price,
      credits: pkg.credits,
      packageName: `${pkg.credits} Credits`,
      stripeSessionId: sessionId,
      status: "success",
      createdAt: new Date(),
    });

    await client.close();
    return Response.json({ success: true, credits: pkg.credits });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
