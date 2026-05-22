import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [
    {
      id: "tcss460",
      name: "Auth2",
      type: "oidc",
      issuer: process.env.AUTH_AUTH2_ISSUER,
      clientId: process.env.AUTH_AUTH2_ID,
      clientSecret: process.env.AUTH_AUTH2_SECRET,
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      authorization: {
        params: {
          scope: "openid email profile",
          audience: process.env.NEXT_PUBLIC_API_AUDIENCE,
        },
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token as string;
        token.idToken = account.id_token as string;
      }
      if (profile) {
        token.role = profile.role as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.idToken = token.idToken as string;
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
