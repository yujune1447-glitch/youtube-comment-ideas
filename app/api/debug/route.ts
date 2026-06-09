export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
  const authSecret = process.env.AUTH_SECRET ?? "";
  const authUrl = process.env.AUTH_URL ?? "";

  return Response.json({
    clientId: {
      set: Boolean(clientId),
      length: clientId.length,
      endsCorrectly: clientId.endsWith(".apps.googleusercontent.com"),
      hasSpaces: /\s/.test(clientId),
    },
    clientSecret: {
      set: Boolean(clientSecret),
      length: clientSecret.length,
      startsCorrectly: clientSecret.startsWith("GOCSPX-"),
      hasSpaces: /\s/.test(clientSecret),
    },
    authSecret: {
      set: Boolean(authSecret),
      length: authSecret.length,
      hasSpaces: /\s/.test(authSecret),
    },
    authUrl: authUrl,
    nodeEnv: process.env.NODE_ENV,
  });
}
