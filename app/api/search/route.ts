import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.TIKAPI_KEY as string;
  
  // Ensure apiKey is defined
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key is not set in the environment" },
      { status: 500 }
    );
  }

  // Use nextUrl instead of URL for better parsing of query params
  const urlParams = new URL(request.url);
  const category = urlParams.searchParams.get("category");
  const query = urlParams.searchParams.get("query");

  console.log("Category:", category);
  console.log("Query:", query);

  if (!category || !query) {
    return NextResponse.json(
      { error: "Missing required query parameters (category or query)" },
      { status: 400 }
    );
  }

  try {
    // Construct the API URL dynamically based on category and query
    const responseData = await fetch(
      `https://api.tikapi.io/public/search/${category}?query=${query}`,
      {
        method: "GET",
        headers: {
          "X-API-KEY": apiKey,
          accept: "application/json",
        },
      }
    );

    if (!responseData.ok) {
      const errorText = await responseData.text();
      console.log("TikAPI User Error:", errorText);
      return NextResponse.json(
        {
          error: `TikAPI response problem occurred: ${responseData.status}: ${errorText}`,
        },
        { status: responseData.status }
      );
    }

    const data = await responseData.json();
    console.log("Parsed Response Data:", data);

    // Return the data
    return NextResponse.json(
      {
        success: true,
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
