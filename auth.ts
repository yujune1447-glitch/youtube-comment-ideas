import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube.readonly",
        },
      },
    }),
  ],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account?.access_token) token.accessToken = account.access_token;
      if (profile?.email) token.email = profile.email;
      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      if (session.user && token.email) session.user.email = token.email as string;
      return session;
    },
  },
});
