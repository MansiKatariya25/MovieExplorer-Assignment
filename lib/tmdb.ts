const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Client-side API calls to our secure endpoints
export async function fetchPopularMovies(page = 1) {
  let response = await fetch(`/api/movies/popular?page=${page}`)

  if (!response.ok) {
    response = await fetch(`/api/movies/popular?page=${page}`)
    return response.json()
  }

  return response.json()
}

export async function searchMovies(query: string, page = 1) {
  const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}&page=${page}`)

  if (!response.ok) {
    throw new Error("Failed to search movies")
  }

  return response?.json()
}

export async function fetchMovieDetails(movieId: number) {
  let response = await fetch(`/api/movies/${movieId}`)

  if (!response?.ok) {
    response = await fetch(`/api/movies/${movieId}`)
    return response.json()
  }

  return response.json()
}

export async function fetchMovieCredits(movieId: number) {
  const response = await fetch(`/api/movies/${movieId}/credits`)

  if (!response.ok) {
    throw new Error("Failed to fetch movie credits")
  }

  return response.json()
}

// Image utilities (no API key needed)
export function getImageUrl(path: string | null, size = "w500"): string {
  if (!path) return "/placeholder.svg?height=750&width=500&text=No+Image"
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export function formatRating(rating: number): string {
  return (rating / 2).toFixed(1) // Convert from 10-point to 5-point scale
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRuntime(minutes: number | null): string {
  if (!minutes) return "N/A"
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}
