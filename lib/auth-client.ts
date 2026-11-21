import { createAuthClient } from "better-auth/react"
import { adminClient, inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
    baseURL:process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
      plugins: [
        jwtClient() ,
    adminClient(),
    inferAdditionalFields({
  user: {
    role: {
      type: "string",
      required: false,
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