"use client"

import type React from "react"

import { Heart } from "lucide-react"
import type { Movie } from "@/types/movie"
import { useFavorites } from "@/hooks/use-favorites"

interface FavoriteButtonProps {
  movie: Movie
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function FavoriteButton({ movie, size = "md", showText = false }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const isMovieFavorite = isFavorite(movie.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isMovieFavorite) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  const buttonSizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={`${buttonSizeClasses[size]} rounded-full transition-all duration-200 hover:scale-110 ${
        isMovieFavorite
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-400"
      } ${showText ? "flex items-center" : ""}`}
      title={isMovieFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`${sizeClasses[size]} ${isMovieFavorite ? "fill-current" : ""}`} />
      {showText && (
        <span className="ml-2 text-sm">{isMovieFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
      )}
    </button>
  )
}
