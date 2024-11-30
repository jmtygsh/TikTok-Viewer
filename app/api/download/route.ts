import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // Parse query parameters from the URL
  const videoUrl = searchParams.get('videourl'); // Get the 'videourl' query parameter

  if (!videoUrl) {
    // Return a response if 'videourl' is not provided
    return NextResponse.json(
      { status: 400, message: "videourl query parameter is missing" }
    );
  }

  // Extract the video ID using a regular expression
  const videoIdMatch = videoUrl.match(/video\/(\d+)/); // Match 'video/123456' pattern
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  if (!videoId) {
    // Return a response if no video ID is found
    return NextResponse.json(
      { status: 404, message: "Video ID not found in the provided URL" }
    );
  }

  // Return the extracted video ID
  return NextResponse.json(
    { status: 200, message: "Video ID extracted successfully", videoId }
  );
}
