import { ConnectButton } from "@/components/connect-button";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <h1>Youtube Comment → Content Ideas</h1>
      <p>What your viewers say, all in one place.</p>
      {session ? (
        <p>Signed in as {session.user?.email}</p>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
