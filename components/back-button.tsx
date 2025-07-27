"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center space-x-2 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Back</span>
    </button>
  )
}
