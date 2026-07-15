import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const PACKAGES = {
  "100": { credits: 100, price: 10 },
  "300": { credits: 300, price: 25 },
  "800": { credits: 800, price: 60 },
  "1500": { credits: 1500, price: 110 },
};

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { credits } = await req.json();
    const pkg = PACKAGES[credits.toString()];
    if (!pkg) {
      return Response.json({ error: "Invalid package" }, { status: 400 });
    }
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${pkg.credits} Credits` },
            unit_amount: pkg.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userEmail: session.user.email,
        credits: pkg.credits.toString(),
      },
      success_url: `${req.headers.get("origin")}/dashboard/supporter/purchase?success=true&credits=${pkg.credits}`,
      cancel_url: `${req.headers.get("origin")}/dashboard/supporter/purchase?canceled=true`,
    });
    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
