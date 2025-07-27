import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import type { Movie } from "@/types/movie"
import { getImageUrl, formatRating } from "@/lib/tmdb"
import { FavoriteButton } from "./favorite-button"

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="group relative">
      <Link href={`/movie/${movie.id}`}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/20 overflow-hidden transition-all duration-200 hover:scale-105 hover:shadow-lg dark:hover:shadow-gray-900/40">
          <div className="relative aspect-[2/3]">
            <Image
              src={getImageUrl(movie.poster_path) || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={false}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatRating(movie.vote_average)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({movie.vote_count})</span>
              </div>

              <span className="text-sm text-gray-600 dark:text-gray-400">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite button positioned absolutely */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FavoriteButton movie={movie} size="sm" />
      </div>
    </div>
  )
}
