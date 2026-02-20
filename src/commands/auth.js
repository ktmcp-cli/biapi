/**
 * Authentication Commands
 *
 * Manage authentication tokens
 */

import chalk from 'chalk';
import ora from 'ora';
import { post, del, formatOutput } from '../lib/api.js';
import { getClientCredentials } from '../lib/config.js';

/**
 * Register authentication commands
 * @param {Command} program - Commander program instance
 */
export function registerAuthCommands(program) {
  const auth = program
    .command('auth')
    .description('Manage authentication tokens');

  auth
    .command('init')
    .description('Create a new temporary token (anonymous user)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating temporary token...').start();
      try {
        const { clientId, clientSecret } = getClientCredentials();
        const data = {};

        if (clientId && clientSecret) {
          data.client_id = clientId;
          data.client_secret = clientSecret;
        }

        const result = await post('/auth/init', data);
        spinner.succeed('Temporary token created');
        console.log(formatOutput(result, options.format));
        console.log(chalk.cyan('\nToken expires in:'), `${result.expires_in} seconds`);
      } catch (error) {
        spinner.fail('Failed to create token');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  auth
    .command('jwt')
    .description('Generate a JWT token')
    .option('--user-id <id>', 'User ID for the token')
    .option('--expire <bool>', 'Whether token should expire (true/false)', 'true')
    .option('--scope <scope>', 'Scope for the token')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Generating JWT token...').start();
      try {
        const { clientId, clientSecret } = getClientCredentials();

        if (!clientId || !clientSecret) {
          throw new Error('Client credentials required. Set BIAPI_CLIENT_ID and BIAPI_CLIENT_SECRET');
        }

        const data = {
          client_id: clientId,
          client_secret: clientSecret,
          expire: options.expire === 'true',
        };

        if (options.userId) data.id_user = parseInt(options.userId);
        if (options.scope) data.scope = options.scope;

        const result = await post('/auth/jwt', data);
        spinner.succeed('JWT token generated');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to generate JWT');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  auth
    .command('revoke')
    .description('Revoke current token')
    .action(async () => {
      const spinner = ora('Revoking token...').start();
      try {
        await del('/auth/token');
        spinner.succeed('Token revoked');
      } catch (error) {
        spinner.fail('Failed to revoke token');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
