// route.ts
import { type NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch"; // ⬅️ Use node-fetch

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    if (!API_KEY) throw new Error("TMDB_API_KEY is undefined");

    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    console.log("Fetching:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed with ${response.status}: ${text}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return NextResponse.json(
      { error: (error as Error).message || "fetch failed" },
      { status: 500 }
    );
  }
}
