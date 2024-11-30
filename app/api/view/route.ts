import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Client from "@/app/models/client";

export async function GET(request: Request): Promise<NextResponse> {
  const apiKey = process.env.TIKAPI_KEY as string;
  const urlParams = new URL(request.url);
  const clientId = urlParams.searchParams.get("client_id");
  const username = urlParams.searchParams.get("username");
  const cursor = urlParams.searchParams.get("cursor"); // Get the cursor from the query


  console.log(`username : ${username}`)
  console.log(`client ID : ${clientId}`)
  console.log(`cursor : ${cursor}`)

  if (!clientId || !username) {
    return NextResponse.json(
      { error: "Missing client_id or username" },
      { status: 400 }
    );
  }

  try {
    // Step 1: Connect to MongoDB
    await connectToDatabase();

    // Step 2: Check if the client_id exists in the database
    const clientRecord = await Client.findOne({ clientId });

    if (clientRecord && clientRecord.username === username && !cursor) {
      // Return cached data for the initial request
      return NextResponse.json(
        { success: true, data: clientRecord.data },
        { status: 200 }
      );
    }

    // Step 3: Fetch user info from TikAPI if not cached or cursor provided
    const userResponse = await fetch(
      `https://api.tikapi.io/public/check?username=${username}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": apiKey,
          accept: "application/json",
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error("TikAPI User Error:", errorText);
      return NextResponse.json(
        {
          error: `TikAPI returned status of check?username: ${userResponse.status}: ${errorText}`,
        },
        { status: userResponse.status }
      );
    }

    const authorData = await userResponse.json();
    const userSecUid = authorData?.userInfo?.user?.secUid;

    if (!userSecUid) {
      console.error("Missing secUid in TikAPI response");
      return NextResponse.json(
        { error: "Invalid or missing secUid in user response" },
        { status: 400 }
      );
    }

    // Step 4: Fetch posts with or without cursor
    const postsEndpoint = `https://api.tikapi.io/public/posts?secUid=${userSecUid}&count=10&country=us${
      cursor ? `&cursor=${cursor}` : ""
    }`;
    const postsResponse = await fetch(postsEndpoint, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

    if (!postsResponse.ok) {
      const errorText = await postsResponse.text();
      console.error("TikAPI Posts Error:", errorText);
      return NextResponse.json(
        {
          error: `TikAPI returned status of posts?secUid: ${postsResponse.status}: ${errorText}`,
        },
        { status: postsResponse.status }
      );
    }

    const authorPostData = await postsResponse.json();
    const nextCursor = authorPostData?.cursor; // Capture the cursor from the response

    // Cache only the first fetch
    if (!cursor) {
      await Client.updateOne(
        { clientId },
        {
          clientId,
          username,
          data: {
            authorData,
            authorPostData,
          },
        },
        { upsert: true } // Create a new document if none exists
      );
    }

    // Return the posts data along with the next cursor
    return NextResponse.json(
      {
        success: true,
        data: {
          authorData,
          authorPostData,
          nextCursor, // Return cursor for pagination
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
