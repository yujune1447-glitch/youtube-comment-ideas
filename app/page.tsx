import { ConnectButton } from "@/components/connect-button";
import { auth } from "@/auth";
import { AnalyseButton } from "@/components/analyse-button";

export default async function Home() {
  const session = await auth();

  return (
    <div>
      <h1>Youtube Comment → Content Ideas</h1>
      <p>What your viewers say, all in one place.</p>
      {session ? (
        <>
          <p>Signed in as {session.user?.email}</p>
          <AnalyseButton />
        </>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
