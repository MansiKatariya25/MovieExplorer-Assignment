import { Header } from "@/components/header"
import { MovieDetailSkeleton } from "@/components/movie-detail-skeleton"

export default function Loading() {
  return (
    <div>
      <Header />
      <MovieDetailSkeleton />
    </div>
  )
}
