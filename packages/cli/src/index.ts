#!/usr/bin/env node

import { Command } from 'commander';
import { UsernameClient } from '@username-dev/client';

const program = new Command();

program
  .name('username-dev')
  .description('Official CLI for username.dev — the complete solution for username governance')
  .version('1.0.0');

program
  .command('check')
  .description('Check if a username is reserved or available')
  .argument('<username>', 'The username to check')
  .option('--json', 'Output raw JSON instead of formatted text')
  .action(async (username: string, options: { json?: boolean }) => {
    const apiKey = process.env.USERNAME_DEV_API_KEY;

    if (!apiKey) {
      console.error(
        'Error: API key missing. Set USERNAME_DEV_API_KEY environment variable or get one at https://app.username.dev/dashboard'
      );
      process.exit(1);
    }

    try {
      const client = new UsernameClient({ apiKey });

      const result = await client.check(username);

      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.isReserved ? 1 : 0);
        return;
      }

      // Format output
      if (result.isReserved) {
        if (result.isDeleted) {
          console.log(`⚠ ${username} is reserved (deleted)`);
        } else {
          console.log(`✗ ${username} is reserved`);
        }

        if (result.categories.length > 0) {
          const categoryStrings = result.categories.map((cat) => {
            let str = cat.category;
            if (cat.metadata) {
              const parts: string[] = [];
              if (cat.metadata.country) {
                parts.push(cat.metadata.country);
              }
              if (cat.metadata.lang) {
                parts.push(cat.metadata.lang);
              }
              if (parts.length > 0) {
                str += ` (${parts.join(', ')})`;
              }
            }
            return str;
          });
          console.log(`  Categories: ${categoryStrings.join(', ')}`);
        }
        process.exit(1);
      } else {
        console.log(`✓ ${username} is available`);
        process.exit(0);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error(`Error: ${error}`);
      }
      process.exit(1);
    }
  });

program.parse();

