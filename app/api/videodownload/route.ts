import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url); // Parse query parameters from the URL
  const videoUrl = searchParams.get("videourl"); // Get the 'videourl' query parameter
  const apiKey = process.env.TIKAPI_KEY as string;

  if (!videoUrl) {
    // Return a response if 'videourl' is not provided
    return NextResponse.json({
      status: 400,
      message: "videourl query parameter is missing",
    });
  }

  console.log(videoUrl)

  // Extract the video ID using a regular expression
  const videoIdMatch = videoUrl.match(/video\/(\d+)/); // Match 'video/123456' pattern
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  if (!videoId) {
    // Return a response if no video ID is found
    return NextResponse.json({
      status: 404,
      message: "Video ID not found in the provided URL",
    });
  }

  const findVideoWithId = await fetch(
    `https://api.tikapi.io/public/video?id=${videoId}&country=us`,
    {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    }
  );

  if (!findVideoWithId.ok) {
    const errorText = await findVideoWithId.text();
    console.log("TikAPI User Error:", errorText);
    return NextResponse.json({
      status: 500,
      message: "something went wrong on api response",
    });
  }

  const videoResponse = await findVideoWithId.json();
  console.log(".......................");
  return NextResponse.json({
    status: 200,
    data: videoResponse,
  });
}

// const value = "https://www.tiktok.com/@kinziebinzz/video/7420545151229136174?is_from_webapp=1&sender_device=pc"; // Trim extra spaces
