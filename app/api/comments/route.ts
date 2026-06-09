import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  // Step 1: get your channel's uploads playlist ID
  const channelRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );
  const channelData = await channelRes.json();
  const uploadsId =
    channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsId) {
    return Response.json({ error: "No uploads found", channelData }, { status: 400 });
  }

  // Step 2: get the 5 most recent videos
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${uploadsId}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` } }
  );
  const videosData = await videosRes.json();
  const videoIds: string[] = videosData.items?.map(
    (v: { snippet: { resourceId: { videoId: string } } }) =>
      v.snippet.resourceId.videoId
  ) ?? [];

  if (!videoIds.length) {
    return Response.json({ error: "No videos found" }, { status: 400 });
  }

  // Step 3: fetch up to 100 comments per video
  const allComments: string[] = [];
  for (const videoId of videoIds) {
    const commentsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&videoId=${videoId}`,
      { headers: { Authorization: `Bearer ${session.accessToken}` } }
    );
    const commentsData = await commentsRes.json();
    const texts: string[] =
      commentsData.items?.map(
        (c: { snippet: { topLevelComment: { snippet: { textDisplay: string } } } }) =>
          c.snippet.topLevelComment.snippet.textDisplay
      ) ?? [];
    allComments.push(...texts);
  }

  return Response.json({ count: allComments.length, comments: allComments });
}
