// types/movie.ts - Combined movie and auth types

// ========== MOVIE TYPES ==========
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface MovieDetails extends Movie {
  runtime: number | null
  budget: number
  revenue: number
  genres: Genre[]
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string | null
  homepage: string | null
  imdb_id: string | null
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
  logo_path: string | null
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface TMDBResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export interface MovieCredits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface Credits extends MovieCredits {}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

// ========== AUTH TYPES ==========
export interface User {
  id: string
  email: string
  name: string
  image?: string | null
  createdAt?: Date
  updatedAt?: Date
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: Omit<User, 'password'>
  error?: string
}

// ========== USER MOVIE INTERACTIONS ==========
export interface UserMovieList {
  id: string
  userId: string
  movieId: number
  movie?: Movie // Optional populated movie data
  addedAt: Date
  type: 'favorite' | 'watchlist' | 'watched'
  rating?: number // User's personal rating (1-10)
  notes?: string // User's personal notes
}

export interface UserMovieRating {
  id: string
  userId: string
  movieId: number
  rating: number // 1-10
  review?: string
  createdAt: Date
  updatedAt: Date
}

// ========== ADDITIONAL MOVIE TYPES ==========
export interface MovieVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  published_at: string
}

export interface MovieVideosResponse {
  id: number
  results: MovieVideo[]
}

export interface Review {
  id: string
  author: string
  author_details: {
    name: string
    username: string
    avatar_path: string | null
    rating: number | null
  }
  content: string
  created_at: string
  updated_at: string
  url: string
}

export interface MovieReviewsResponse {
  id: number
  page: number
  results: Review[]
  total_pages: number
  total_results: number
}

// ========== API & FORM TYPES ==========
export interface MovieSearchParams {
  query?: string
  page?: number
  include_adult?: boolean
  region?: string
  year?: number
  primary_release_year?: number
}

export interface DiscoverMovieParams {
  page?: number
  region?: string
  sort_by?: string
  with_genres?: string
  without_genres?: string
  primary_release_date_gte?: string
  primary_release_date_lte?: string
  vote_average_gte?: number
  vote_average_lte?: number
  include_adult?: boolean
}

// ========== UTILITY TYPES ==========
export type MovieStatus = 'Rumored' | 'Planned' | 'In Production' | 'Post Production' | 'Released' | 'Canceled'

export type MovieSortBy = 
  | 'popularity.asc'
  | 'popularity.desc'
  | 'release_date.asc'
  | 'release_date.desc'
  | 'vote_average.asc'
  | 'vote_average.desc'

export type UserMovieListType = 'favorite' | 'watchlist' | 'watched'

// ========== ERROR TYPES ==========
export interface TMDBError {
  success: boolean
  status_code: number
  status_message: string
}

export interface AuthError {
  success: false
  error: string
  details?: any
}

// ========== NEXTAUTH TYPE EXTENSIONS ==========
// These extend the default NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}