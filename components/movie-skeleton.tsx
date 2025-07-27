export function MovieSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/20 overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-300 dark:bg-gray-700" />
      <div className="p-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="flex justify-between">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16" />
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-12" />
        </div>
      </div>
    </div>
  )
}
