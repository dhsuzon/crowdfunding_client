import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const getDb = () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  const client = new MongoClient(uri);
  return client.db();
};

const db = getDb();

export const auth = betterAuth({
  ...(db ? { database: mongodbAdapter(db) } : {}),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "supporter",
      },
      credits: {
        type: "number",
        defaultValue: 50,
      },
      totalRaisedCredits: {
        type: "number",
        defaultValue: 0,
      },
      photoURL: {
        type: "string",
        defaultValue: "",
      },
    },
  },
});
