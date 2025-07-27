"use server"

const TMDB_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = process.env.TMDB_API_KEY

export async function getPopularMovies(page = 1) {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error("Failed to fetch popular movies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    throw new Error("Failed to fetch movies")
  }
}

export async function searchMoviesAction(query: string, page = 1) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
      {
        next: { revalidate: 300 },
      },
    )

    if (!response.ok) {
      throw new Error("Failed to search movies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching movies:", error)
    throw new Error("Failed to search movies")
  }
}

export async function getMovieDetails(movieId: number) {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${API_KEY}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch movie details")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching movie details:", error)
    throw new Error("Failed to fetch movie details")
  }
}

export async function getMovieCredits(movieId: number) {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch movie credits")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching movie credits:", error)
    throw new Error("Failed to fetch movie credits")
  }
}
