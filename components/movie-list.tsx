"use client"

import { useState, useEffect, useCallback } from "react"
import type { Movie, TMDBResponse } from "@/types/movie"
import { fetchPopularMovies, searchMovies } from "@/lib/tmdb"
import { MovieCard } from "./movie-card"
import { MovieSkeleton } from "./movie-skeleton"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { AlertCircle, Loader2 } from "lucide-react"

interface MovieListProps {
  searchQuery?: string
}

export function MovieList({ searchQuery }: MovieListProps) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasNextPage = currentPage < totalPages
  const isFetchingNextPage = isFetchingMore

  const fetchMovies = useCallback(
    async (page: number, isNewSearch = false) => {
      try {
        setError(null)
        if (page === 1) setIsLoading(true)
        else setIsFetchingMore(true)

        const response: TMDBResponse = searchQuery
          ? await searchMovies(searchQuery, page)
          : await fetchPopularMovies(page)

        if (isNewSearch || page === 1) {
          setMovies(response.results)
        } else {
          setMovies((prev) => [...prev, ...response.results])
        }

        setCurrentPage(response.page)
        setTotalPages(response.total_pages)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
        setIsFetchingMore(false)
      }
    },
    [searchQuery],
  )

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchMovies(currentPage + 1)
    }
  }, [currentPage, hasNextPage, isFetchingNextPage, fetchMovies])

  const { loadMoreRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  useEffect(() => {
    setCurrentPage(1)
    fetchMovies(1, true)
  }, [fetchMovies])

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 20 }).map((_, index) => (
          <MovieSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Error Loading Movies</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">{error}</p>
        <button
          onClick={() => fetchMovies(1, true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (movies?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Movies Found</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          {searchQuery ? `No results found for "${searchQuery}"` : "No movies available"}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies?.map((movie) => (
          <MovieCard key={movie?.id} movie={movie} />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingMore && (
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading more movies...</span>
          </div>
        )}
      </div>

      {!hasNextPage && movies?.length > 0 && (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">You've reached the end of the list</div>
      )}
    </div>
  )
}
