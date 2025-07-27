"use client"

import { useState, useEffect } from "react"
import type { Movie } from "@/types/movie"
import { getFavorites, addToFavorites, removeFromFavorites, isFavorite } from "@/lib/favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([])

  useEffect(() => {
    // Load initial favorites
    setFavorites(getFavorites())

    // Listen for favorites changes
    const handleFavoritesChange = () => {
      setFavorites(getFavorites())
    }

    window.addEventListener("favoritesChanged", handleFavoritesChange)
    return () => window.removeEventListener("favoritesChanged", handleFavoritesChange)
  }, [])

  const addFavorite = (movie: Movie) => {
    addToFavorites(movie)
  }

  const removeFavorite = (movieId: number) => {
    removeFromFavorites(movieId)
  }

  const checkIsFavorite = (movieId: number) => {
    return isFavorite(movieId)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite: checkIsFavorite,
  }
}
