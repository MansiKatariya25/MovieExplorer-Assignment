"use client"

import { useState } from "react"
import { MovieList } from "@/components/movie-list"
import { SearchBar } from "@/components/search-bar"
import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Discover Movies</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Explore and find your favorite movies</p>
            <SearchBar onSearch={setSearchQuery} />
          </header>

          <main>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {searchQuery ? `Search results for "${searchQuery}"` : "Popular Movies"}
              </h2>
            </div>
            <MovieList searchQuery={searchQuery} />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
