"use client"

import type { Movie } from "@/types/movie"

const FAVORITES_KEY = "movie-favorites"

export function getFavorites(): Movie[] {
  if (typeof window === "undefined") return []

  try {
    const favorites = localStorage.getItem(FAVORITES_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error)
    return []
  }
}

export function addToFavorites(movie: Movie): void {
  if (typeof window === "undefined") return

  try {
    const favorites = getFavorites()
    const isAlreadyFavorite = favorites.some((fav) => fav.id === movie.id)

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites, movie]
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))

      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent("favoritesChanged"))
    }
  } catch (error) {
    console.error("Error adding to favorites:", error)
  }
}

export function removeFromFavorites(movieId: number): void {
  if (typeof window === "undefined") return

  try {
    const favorites = getFavorites()
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites))

    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent("favoritesChanged"))
  } catch (error) {
    console.error("Error removing from favorites:", error)
  }
}

export function isFavorite(movieId: number): boolean {
  const favorites = getFavorites()
  return favorites.some((movie) => movie.id === movieId)
}
