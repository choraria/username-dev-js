/**
 * Response from the username check API endpoint
 */
export interface UsernameCheckResponse {
  /** The normalized username that was checked (whitespace removed, lowercase) */
  username: string;
  /** Whether the username is reserved (exists in the database with one or more categories). True if reserved, false if available. */
  isReserved: boolean;
  /** Whether the username has been marked as deleted. Deleted usernames are still considered reserved but may be flagged differently. */
  isDeleted: boolean;
  /** List of categories associated with this username. Empty array if username is not reserved. */
  categories: UsernameCategory[];
}

/**
 * A category associated with a username
 */
export interface UsernameCategory {
  /** The category name */
  category:
    | 'other'
    | 'dictionary'
    | 'city'
    | 'country'
    | 'region'
    | 'brand'
    | 'first_name'
    | 'last_name'
    | 'system'
    | 'restricted'
    | 'product'
    | 'public_figure'
    | 'government'
    | 'agency'
    | 'institution'
    | 'event'
    | 'company'
    | 'place'
    | 'organization';
  /** Optional metadata associated with the category */
  metadata?: CategoryMetadata;
}

/**
 * Metadata associated with a category
 */
export interface CategoryMetadata {
  /** ISO country code (e.g., 'DE' for Germany, 'US' for United States) */
  country?: string;
  /** Language code (e.g., 'en' for English, 'de' for German) */
  lang?: string;
}

/**
 * RFC 7807 Problem Details for HTTP APIs error response format
 */
export interface ProblemDetail {
  /** A URI reference that identifies the problem type */
  type: string;
  /** A short, human-readable summary of the problem type */
  title: string;
  /** The HTTP status code for this occurrence of the problem */
  status: number;
  /** A human-readable explanation specific to this occurrence of the problem */
  detail: string;
  /** A URI reference that identifies the specific occurrence of the problem */
  instance: string;
  /** Number of seconds to wait before retrying the request. Only included in 429 (Rate Limit Exceeded) responses. */
  retryAfter?: number;
}

