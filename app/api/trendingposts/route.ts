import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const apiKey = process.env.TIKAPI_KEY as string;

  try {
    // Step 1: Fetch data
    const userResponse = await fetch(`https://api.tikapi.io/public/explore?count=10&country=us`, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey,
        accept: "application/json",
      },
    });

  
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.log("TikAPI User Error:", errorText);
      return NextResponse.json(
        {
          error: `TikAPI response problem occurred: ${userResponse.status}: ${errorText}`,
        },
        { status: userResponse.status }
      );
    }

    // Step 2: Parse the JSON data
    const responseData = await userResponse.json();
    
    console.log("Parsed Response Data:", responseData);

    // Return the data
    return NextResponse.json(
      {
        success: true,
        data: responseData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.log("Unexpected Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
