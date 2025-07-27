"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BackButton } from "@/components/back-button"
import { FavoriteButton } from "@/components/favorite-button"
import { MovieDetailSkeleton } from "@/components/movie-detail-skeleton"
import type { MovieDetails, MovieCredits } from "@/types/movie"
import { Loader2, Calendar, Clock, DollarSign, Star } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { getMovieCredits, getMovieDetails } from "@/lib/server-actions"

export default function MovieDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const movieId = params.id as string

  const [movie, setMovie] = useState<MovieDetails | null>(null)
  const [credits, setCredits] = useState<MovieCredits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  useEffect(() => {
    if (!movieId) return

    const fetchMovieData = async () => {
      try {
        setLoading(true)
        const [movieDetails, movieCredits] = await Promise.all([
          getMovieDetails(Number(movieId)),
          getMovieCredits(Number(movieId)),
        ])
        setMovie(movieDetails)
        setCredits(movieCredits)
      } catch (err) {
        setError("Failed to load movie details")
        console.error("Error fetching movie data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieData()
  }, [movieId])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <MovieDetailSkeleton />
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Movie Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The movie you're looking for doesn't exist."}
            </p>
            <BackButton />
          </div>
        </div>
      </div>
    )
  }

  const director = credits?.crew.find((person: any) => person.job === "Director")
  const mainCast = credits?.cast.slice(0, 6) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <div className="relative">
        {movie.backdrop_path && (
          <div className="absolute inset-0 z-0">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-80 mx-auto lg:mx-0">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg?height=600&width=400"
                  }
                  alt={movie.title}
                  width={400}
                  height={600}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white">
              <div className="mb-4">
                <BackButton />
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold mb-4">{movie.title}</h1>

              {movie.tagline && <p className="text-xl italic text-gray-300 mb-6">{movie.tagline}</p>}

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-gray-300">({movie.vote_count} votes)</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>

                {movie.runtime && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>
                      {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <div className="mb-6">
                <FavoriteButton movie={movie} />
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Overview</h3>
                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
              </div>

              {director && (
                <div className="mb-4">
                  <span className="font-semibold">Director: </span>
                  <span className="text-gray-300">{director.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {mainCast.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mainCast.map((actor: any) => (
              <div key={actor.id} className="text-center">
                <div className="mb-3">
                  <Image
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                        : "/placeholder.svg?height=278&width=185"
                    }
                    alt={actor.name}
                    width={185}
                    height={278}
                    className="rounded-lg mx-auto"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">{actor.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Details */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Production Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Production Details</h3>
            <div className="space-y-3">
              {movie.budget > 0 && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">${movie.budget.toLocaleString()}</span>
                </div>
              )}

              {movie.revenue > 0 && (
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    ${movie.revenue.toLocaleString()}
                  </span>
                </div>
              )}

              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{movie.status}</span>
              </div>

              <div>
                <span className="text-gray-600 dark:text-gray-400">Original Language:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-gray-100 uppercase">
                  {movie.original_language}
                </span>
              </div>
            </div>
          </div>

          {/* Production Companies */}
          {movie.production_companies.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Production Companies</h3>
              <div className="space-y-3">
                {movie.production_companies.map((company: any) => (
                  <div key={company.id} className="flex items-center space-x-3">
                    {company.logo_path && (
                      <Image
                        src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                        alt={company.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    )}
                    <span className="text-gray-900 dark:text-gray-100">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
