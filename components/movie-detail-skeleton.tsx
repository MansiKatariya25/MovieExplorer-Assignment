export function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section Skeleton */}
      <div className="relative h-[50vh] md:h-[60vh] bg-gray-300 dark:bg-gray-700 animate-pulse" />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster Skeleton */}
          <div className="lg:col-span-1">
            <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>

          {/* Details Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="flex space-x-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
