import type {
  UsernameCheckResponse,
  ProblemDetail,
} from './types.js';

export * from './types.js';

/**
 * Client options for UsernameClient
 */
export interface UsernameClientOptions {
  /** API key in format: un_live_<32-char-random> */
  apiKey: string;
  /** Base URL for the API. Defaults to https://api.username.dev */
  baseUrl?: string;
}

/**
 * Official JavaScript SDK for username.dev
 */
export class UsernameClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: UsernameClientOptions) {
    if (!options.apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? 'https://api.username.dev';
  }

  /**
   * Check if a username is reserved or available
   * @param username The username to check
   * @returns Promise resolving to the username check response
   * @throws Error if the request fails or the username is invalid
   */
  async check(username: string): Promise<UsernameCheckResponse> {
    if (!username || username.trim().length === 0) {
      throw new Error('Username cannot be empty');
    }

    const encodedUsername = encodeURIComponent(username);
    const url = `${this.baseUrl}/check?input=${encodedUsername}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json() as ProblemDetail;
        
        // Create actionable error messages
        let errorMessage = `[${error.status}] ${error.title}: ${error.detail}`;
        
        if (error.status === 401) {
          errorMessage += ' Check your API key at https://app.username.dev/dashboard';
        } else if (error.status === 402) {
          errorMessage += ' Purchase additional requests at https://app.username.dev/dashboard';
        } else if (error.status === 429 && error.retryAfter) {
          errorMessage += ` Retry after ${error.retryAfter} second${error.retryAfter > 1 ? 's' : ''}.`;
        } else if (error.status === 503) {
          errorMessage += ' The service is temporarily unavailable. Please try again later.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json() as UsernameCheckResponse;
      return data;
    } catch (error) {
      // Re-throw our own errors
      if (error instanceof Error) {
        throw error;
      }
      // Handle network errors and other unexpected errors
      throw new Error(`Network error: ${error}`);
    }
  }
}

