import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SignJWT } from "jose";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const secret = new TextEncoder().encode(process.env.BETTER_AUTH_SECRET || "");
    const token = await new SignJWT({
      sub: session.user.id,
      email: session.user.email,
      role: session.user.role,
      name: session.user.name,
      credits: session.user.credits,
      totalRaisedCredits: session.user.totalRaisedCredits,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    return Response.json({ token });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
