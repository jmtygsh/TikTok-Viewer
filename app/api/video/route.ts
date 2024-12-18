import { NextResponse } from "next/server";
import fetch from 'node-fetch';  // Import node-fetch for server-side requests
import { URL } from 'url';       // For extracting query parameters from the request URL
import { HttpsProxyAgent } from 'https-proxy-agent'; // Correct import for https-proxy-agent

// URL of the Squid proxy with username and password
const proxyUrl = "http://ygshjmt:yogesh1590@93.127.216.31:3128";  // Replace with actual username and password

// Create an HTTPS proxy agent
const agent = new HttpsProxyAgent(proxyUrl);  // Using https-proxy-agent to handle both HTTP and HTTPS

export async function GET(req: Request) {
  try {
    // Extract query parameters from the URL
    const { searchParams } = new URL(req.url);
    
    // Construct the TikTok video URL using the query parameters
    const tikTokUrl = `https://www.tiktok.com/aweme/v1/play/?${searchParams.toString()}`;

    // Fetch the video from TikTok via the proxy
    const response = await fetch(tikTokUrl, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent": "Mozilla/5.0",
        Cookie: req.headers.get("cookie") || "", // Forward cookie if it exists
      },
      // Set the custom HTTPS proxy agent for routing requests through the proxy
      agent: agent, // Using the https-proxy-agent
    });

    // If the fetch fails, handle the response properly
    if (!response.ok) {
      console.error(`TikTok API Error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch TikTok video: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Stream the TikTok video directly to the client
    return new Response(response.body, {
      headers: {
        "Content-Type": "video/mp4",
      },
      status: response.status,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}


