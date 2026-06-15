import { supabase } from "@/lib/supabase";

import { auth } from "@/auth";
import Groq from "groq-sdk";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  if (!session.accessToken) {
    return Response.json({ error: "Session expired — please sign out and sign in again" }, { status: 401 });
  }

  // Fetch channel uploads playlist
  const channelRes = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true",
    { headers: { Authorization: `Bearer ${session.accessToken}` }, cache: "no-store" }
  );
  const channelData = await channelRes.json();


  if (!channelRes.ok) {
    const msg = channelData?.error?.message ?? channelRes.statusText;
    return Response.json({ error: `YouTube API error: ${msg}` }, { status: channelRes.status });
  }

  const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) {
    return Response.json({ error: "No uploads playlist found on your channel" }, { status: 400 });
  }

  // Get 10 most recent videos
  const videosRes = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${uploadsId}`,
    { headers: { Authorization: `Bearer ${session.accessToken}` }, cache: "no-store" }
  );
  const videosData = await videosRes.json();
  const videoIds: string[] = videosData.items?.map(
    (v: { snippet: { resourceId: { videoId: string } } }) => v.snippet.resourceId.videoId
  ) ?? [];

  // Fetch comments using API key
  const apiKey = process.env.YOUTUBE_API_KEY;
  const allComments: string[] = [];
  for (const videoId of videoIds) {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&videoId=${videoId}&key=${apiKey}`
    );
    const data = await res.json();
    if (data.error) continue;
    const texts: string[] = data.items?.map(
      (c: { snippet: { topLevelComment: { snippet: { textDisplay: string } } } }) =>
        c.snippet.topLevelComment.snippet.textDisplay
    ) ?? [];
    allComments.push(...texts);
  }

  if (allComments.length === 0) {
    return Response.json({ error: "No comments found", videoIds, apiKeySet: Boolean(process.env.YOUTUBE_API_KEY) }, { status: 400 });
  }

  // Send to Gemini for clustering
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const prompt = `Here are ${allComments.length} YouTube comments from a creator's recent videos.

Identify the top 10 recurring themes or questions that appear most frequently. For each theme:
- Give it a short title (5 words max)
- Write one sentence describing what viewers are asking/saying
- Estimate how many comments relate to it

Return ONLY a JSON array like this:
[
  { "rank": 1, "title": "...", "description": "...", "count": 42 },
  ...
]

Comments:
${allComments.slice(0, 100).join("\n")}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });
    const text = completion.choices[0]?.message?.content ?? "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return Response.json({ error: "AI parsing failed", raw: text }, { status: 500 });
    }

    const themes = JSON.parse(jsonMatch[0]);


    const { error: insertError } = await supabase.from("analyses").insert({
      user_id: (session as any).userId,
      comment_count: allComments.length,
      themes: themes,
      created_at: new Date().toISOString(),
    });
    
    if (insertError) {
      console.error("Supabase insert error:", insertError);
}

return Response.json({ themes, commentCount: allComments.length });
  } catch (e) {
    return Response.json({ error: "Gemini error", detail: String(e) }, { status: 500 });
  }
}
