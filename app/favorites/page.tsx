"use client"

import { Header } from "@/components/header"
import { MovieCard } from "@/components/movie-card"
import { useFavorites } from "@/hooks/use-favorites"
import { ProtectedRoute } from "@/components/protected-route"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-red-500" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">My Favorites</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {favorites.length > 0
                ? `You have ${favorites.length} favorite movie${favorites.length === 1 ? "" : "s"}`
                : "You haven't added any movies to your favorites yet"}
            </p>
          </header>

          <main>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {favorites.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No favorites yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start exploring movies and add them to your favorites!
                </p>
                <a
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Discover Movies
                </a>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
