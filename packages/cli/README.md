<p align="center">
  <a href="https://www.username.dev">
    <img src="https://raw.githubusercontent.com/choraria/username-dev-js/main/assets/cover.png" alt="username.dev - The complete solution for username governance" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@username-dev/client"><img src="https://img.shields.io/npm/v/@username-dev/client?color=blue&label=SDK" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/username-dev"><img src="https://img.shields.io/npm/v/username-dev?color=blue&label=CLI" alt="npm version"></a>
  <a href="https://github.com/choraria/username-dev-js/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
  <a href="https://status.username.dev"><img src="https://img.shields.io/badge/status-operational-brightgreen" alt="Status"></a>
</p>

<p align="center">
  <strong>Official JavaScript SDK and CLI for <a href="https://www.username.dev">username.dev</a></strong><br>
  The complete solution for username governance.
</p>

<p align="center">
  <a href="https://docs.username.dev">Documentation</a> •
  <a href="https://app.username.dev/dashboard">Get API Key</a> •
  <a href="https://status.username.dev">Status</a> •
  <a href="#support">Support</a>
</p>

---

## Overview

**username.dev** provides a REST API that helps platforms validate and moderate usernames at registration time. Instead of building and maintaining your own profanity filters, brand protection lists, and reserved username databases, you can use our API to get instant results on whether a username should be allowed, flagged, or blocked.

Filter brands, profanity, reserved words, and premium names with a single API call. Stop maintaining blacklists—let the API govern usernames for you.

## Table of Contents

- [Features](#features)
- [Packages](#packages)
- [Quick Start](#quick-start)
- [SDK Documentation](#sdk-documentation)
  - [Installation](#sdk-installation)
  - [Usage](#sdk-usage)
  - [API Response](#api-response)
  - [TypeScript Types](#typescript-types)
- [CLI Documentation](#cli-documentation)
  - [Installation](#cli-installation)
  - [Usage](#cli-usage)
  - [Output Examples](#cli-output-examples)
- [Categories](#categories)
- [Error Handling](#error-handling)
- [Security](#security)
- [Requirements](#requirements)
- [Support](#support)
- [Contributing](#contributing)
- [License](#license)

## Features

The username.dev API detects **19+ categories** including:

| Category | Description | Example |
|----------|-------------|---------|
| **Brands** | Trademarked company names | `google`, `apple`, `microsoft` |
| **Profanity** | Offensive and inappropriate content | — |
| **Public Figures** | Celebrity and influencer names | `taylorswift`, `elonmusk` |
| **Geographic** | Cities, countries, and regions | `paris`, `germany`, `california` |
| **Government** | Official agencies and institutions | `fbi`, `cia`, `whitehouse` |
| **System** | Infrastructure and admin terms | `admin`, `root`, `api` |
| **Premium** | High-value short usernames | `x`, `ai`, `go` |
| **Dictionary** | Common English words | `hello`, `world` |
| **First Names** | Common given names | `john`, `sarah` |
| **Last Names** | Common family names | `smith`, `johnson` |
| **Products** | Product names | — |
| **Companies** | Company names | — |
| **Organizations** | Non-profit and other orgs | — |
| **Agencies** | Government agencies | — |
| **Institutions** | Educational and other institutions | — |
| **Events** | Named events | — |
| **Places** | Points of interest | — |
| **Restricted** | Platform-specific blocked terms | — |
| **Other** | Miscellaneous reserved terms | — |

## Packages

This monorepo contains two packages:

| Package | Description | npm |
|---------|-------------|-----|
| [`@username-dev/client`](https://github.com/choraria/username-dev-js/tree/main/packages/client) | JavaScript/TypeScript SDK | [![npm](https://img.shields.io/npm/v/@username-dev/client)](https://www.npmjs.com/package/@username-dev/client) |
| [`username-dev`](https://github.com/choraria/username-dev-js/tree/main/packages/cli) | Command-line interface | [![npm](https://img.shields.io/npm/v/username-dev)](https://www.npmjs.com/package/username-dev) |

## Quick Start

### 1. Get an API Key

Sign up at [app.username.dev](https://app.username.dev/dashboard) to get your API key.

> **Note:** You get **1,000 free requests** with no credit card required.

### 2. Install the SDK

```bash
npm install @username-dev/client
```

### 3. Check a Username

```typescript
import { UsernameClient } from '@username-dev/client';

const client = new UsernameClient({ 
  apiKey: process.env.USERNAME_DEV_API_KEY 
});

const result = await client.check('taylorswift');

if (result.isReserved) {
  console.log('Username is reserved:', result.categories);
} else {
  console.log('Username is available!');
}
```

---

## SDK Documentation

### SDK Installation

```bash
# npm
npm install @username-dev/client

# yarn
yarn add @username-dev/client

# pnpm
pnpm add @username-dev/client
```

### SDK Usage

#### Basic Usage

```typescript
import { UsernameClient } from '@username-dev/client';

const client = new UsernameClient({ 
  apiKey: 'un_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' 
});

const result = await client.check('berlin');

console.log(result.username);    // "berlin" (normalized)
console.log(result.isReserved);  // true
console.log(result.isDeleted);   // false
console.log(result.categories);  // [{ category: 'city', metadata: { country: 'DE' } }]
```

#### With Custom Base URL

```typescript
const client = new UsernameClient({ 
  apiKey: 'un_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  baseUrl: 'https://api.username.dev' // optional, this is the default
});
```

### API Response

```typescript
interface UsernameCheckResponse {
  /** The normalized username (lowercase, whitespace removed) */
  username: string;
  
  /** Whether the username is reserved (exists in the database) */
  isReserved: boolean;
  
  /** Whether the username has been marked as deleted */
  isDeleted: boolean;
  
  /** Categories associated with this username (empty if not reserved) */
  categories: UsernameCategory[];
}

interface UsernameCategory {
  /** The category name */
  category: 
    | 'brand' | 'city' | 'country' | 'region' | 'place'
    | 'public_figure' | 'government' | 'agency' | 'institution'
    | 'system' | 'restricted' | 'dictionary'
    | 'first_name' | 'last_name'
    | 'product' | 'company' | 'organization'
    | 'event' | 'other';
  
  /** Optional metadata (e.g., country code, language) */
  metadata?: {
    country?: string;  // ISO 3166-1 alpha-2 (e.g., "DE", "US")
    lang?: string;     // Language code (e.g., "en", "de")
  };
}
```

### TypeScript Types

All types are exported from the package:

```typescript
import type { 
  UsernameClient,
  UsernameClientOptions,
  UsernameCheckResponse, 
  UsernameCategory, 
  CategoryMetadata,
  ProblemDetail 
} from '@username-dev/client';
```

---

## CLI Documentation

### CLI Installation

```bash
# Install globally
npm install -g username-dev

# Or use with npx (no installation required)
npx username-dev check <username>
```

### CLI Usage

#### Set Your API Key

```bash
# Set as environment variable
export USERNAME_DEV_API_KEY=un_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Or add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
echo 'export USERNAME_DEV_API_KEY=un_live_xxx...' >> ~/.zshrc
```

#### Check a Username

```bash
username-dev check <username> [options]
```

**Options:**

| Option | Description |
|--------|-------------|
| `--json` | Output raw JSON instead of formatted text |
| `--help` | Display help information |
| `--version` | Display version number |

### CLI Output Examples

**Available username:**

```
$ username-dev check randomstring123
✓ randomstring123 is available
```

**Reserved username:**

```
$ username-dev check berlin
✗ berlin is reserved
  Categories: city (DE), government (DE)
```

**Deleted username:**

```
$ username-dev check deleteduser
⚠ deleteduser is reserved (deleted)
  Categories: restricted
```

**JSON output:**

```bash
$ username-dev check paris --json
```

```json
{
  "username": "paris",
  "isReserved": true,
  "isDeleted": false,
  "categories": [
    {
      "category": "city",
      "metadata": {
        "country": "FR"
      }
    }
  ]
}
```

**Exit Codes:**

| Code | Meaning |
|------|---------|
| `0` | Username is available |
| `1` | Username is reserved or an error occurred |

---

## Categories

The API detects 19+ username categories. Many categories include metadata such as:

- **Country codes** — ISO 3166-1 alpha-2 format (e.g., `DE` for Germany, `US` for United States)
- **Language codes** — ISO 639-1 format (e.g., `en` for English, `de` for German)

### Category Reference

| Category | Description | Has Metadata |
|----------|-------------|--------------|
| `brand` | Trademarked brand names | — |
| `city` | City names | `country` |
| `country` | Country names | `country` |
| `region` | State, province, or region names | `country` |
| `place` | Points of interest, landmarks | `country` |
| `public_figure` | Celebrities, influencers, notable people | — |
| `government` | Government-related terms | `country` |
| `agency` | Government agencies | `country` |
| `institution` | Educational and other institutions | — |
| `system` | System and infrastructure terms | — |
| `restricted` | Platform-blocked terms | — |
| `dictionary` | Common dictionary words | `lang` |
| `first_name` | Common given names | `lang` |
| `last_name` | Common family names | `lang` |
| `product` | Product names | — |
| `company` | Company names | — |
| `organization` | Non-profit and other organizations | — |
| `event` | Named events | — |
| `other` | Miscellaneous reserved terms | — |

---

## Error Handling

The SDK throws descriptive errors for common API responses. All errors follow the [RFC 7807 Problem Details](https://datatracker.ietf.org/doc/html/rfc7807) format.

### Error Types

| Status | Error | Description | Action |
|--------|-------|-------------|--------|
| `400` | Bad Request | Invalid input (empty username, invalid characters) | Fix the input |
| `401` | Unauthorized | Invalid API key or account deleted | Check your API key at [dashboard](https://app.username.dev/dashboard) |
| `402` | Payment Required | Request quota depleted | Purchase more requests at [dashboard](https://app.username.dev/dashboard) |
| `429` | Too Many Requests | Rate limit exceeded | Wait and retry (see `retryAfter` in response) |
| `503` | Service Unavailable | API temporarily unavailable | Retry later, check [status](https://status.username.dev) |

### Error Handling Example

```typescript
import { UsernameClient } from '@username-dev/client';

const client = new UsernameClient({ apiKey: process.env.USERNAME_DEV_API_KEY });

try {
  const result = await client.check('username');
  // Handle result
} catch (error) {
  if (error.message.includes('[429]')) {
    // Rate limited - wait and retry
    console.log('Rate limited. Please wait before retrying.');
  } else if (error.message.includes('[402]')) {
    // Quota depleted
    console.log('Quota depleted. Purchase more requests.');
  } else if (error.message.includes('[401]')) {
    // Invalid API key
    console.log('Invalid API key. Check your credentials.');
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

---

## Security

> **Warning:** Never commit API keys to version control. Always use environment variables.

### Best Practices

1. **Use environment variables** for API keys:

   ```bash
   export USERNAME_DEV_API_KEY=un_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

2. **Add `.env` to `.gitignore`**:

   ```bash
   echo ".env" >> .gitignore
   ```

3. **Use `.env` files** for local development:

   ```bash
   # .env (do NOT commit this file)
   USERNAME_DEV_API_KEY=un_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

4. **Use secret management** in production (e.g., AWS Secrets Manager, HashiCorp Vault, Vercel Environment Variables)

### API Key Format

API keys follow the format: `un_live_<32-character-random-string>`

Example: `un_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

---

## Requirements

- **Node.js** >= 18.0.0 (for native `fetch` support)
- **TypeScript** >= 5.0.0 (optional, for type definitions)

---

## Support

- **Documentation:** [docs.username.dev](https://docs.username.dev)
- **Dashboard:** [app.username.dev](https://app.username.dev/dashboard)
- **Status Page:** [status.username.dev](https://status.username.dev)
- **Email:** sourabh@username.dev
- **GitHub Issues:** [github.com/choraria/username-dev-js/issues](https://github.com/choraria/username-dev-js/issues)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License

Copyright (c) 2025 Sourabh Choraria

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

<p align="center">
  <a href="https://www.username.dev">
    <img src="https://raw.githubusercontent.com/choraria/username-dev-js/main/assets/logo.png" alt="username.dev" width="48" height="48">
  </a>
</p>

<p align="center">
  Built with care by <a href="https://github.com/choraria">Sourabh Choraria</a>
</p>

<p align="center">
  <a href="https://www.username.dev">Website</a> •
  <a href="https://app.username.dev/dashboard">Dashboard</a> •
  <a href="https://docs.username.dev">Documentation</a> •
  <a href="https://status.username.dev">Status</a>
</p>
