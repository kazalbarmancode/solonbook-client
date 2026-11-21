
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin, jwt } from "better-auth/plugins";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is missing from environment variables");
}

// Reuse MongoDB client across serverless invocations
const globalForMongo = globalThis as typeof globalThis & {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  (globalForMongo.mongoClient = new MongoClient(MONGODB_URL));

const db = client.db("salonbook");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
        returned: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
        returned: true,
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "customer",
      adminRoles: ["admin"],
    }),
    jwt(),
  ],
});
