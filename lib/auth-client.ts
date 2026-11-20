import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
    baseURL:process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      plugins: [
    adminClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
        phone: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});
export const { signIn, signUp, useSession } = authClient