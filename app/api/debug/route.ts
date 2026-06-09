export async function GET() {
  return Response.json({
    hasGoogleId: Boolean(process.env.GOOGLE_CLIENT_ID),
    googleIdOk: process.env.GOOGLE_CLIENT_ID?.endsWith(".apps.googleusercontent.com"),
    hasGoogleSecret: Boolean(process.env.GOOGLE_CLIENT_SECRET),
    googleSecretOk: process.env.GOOGLE_CLIENT_SECRET?.startsWith("GOCSPX-"),
    hasAuthSecret: Boolean(process.env.AUTH_SECRET),
    authSecretLen: process.env.AUTH_SECRET?.length,
    hasAuthTrustHost: Boolean(process.env.AUTH_TRUST_HOST),
    authUrl: process.env.AUTH_URL,
    nodeEnv: process.env.NODE_ENV,
  });
}
