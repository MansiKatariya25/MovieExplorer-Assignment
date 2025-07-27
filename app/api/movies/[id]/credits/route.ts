import { type NextRequest, NextResponse } from "next/server"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.TMDB_API_KEY

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const movieId = params.id

    if (!movieId) {
      return NextResponse.json({ error: "Movie ID is required" }, { status: 400 })
    }

    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch movie credits")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching movie credits:", error)
    return NextResponse.json({ error: "Failed to fetch movie credits" }, { status: 500 })
  }
}
