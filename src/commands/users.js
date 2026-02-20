/**
 * Users Commands
 *
 * Manage users in the Budgea API
 */

import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, del, formatOutput } from '../lib/api.js';

/**
 * Register user commands
 * @param {Command} program - Commander program instance
 */
export function registerUserCommands(program) {
  const users = program
    .command('users')
    .description('Manage users');

  users
    .command('me')
    .description('Get current user information')
    .option('--expand <resources>', 'Expand related resources (e.g., connections,accounts)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching user information...').start();
      try {
        const params = {};
        if (options.expand) {
          params.expand = options.expand;
        }

        const data = await get('/users/me', params);
        spinner.succeed('User information retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch user information');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  users
    .command('list')
    .description('List all users (admin only)')
    .option('--limit <number>', 'Limit number of results', '50')
    .option('--offset <number>', 'Offset for pagination', '0')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching users...').start();
      try {
        const params = {
          limit: parseInt(options.limit),
          offset: parseInt(options.offset),
        };

        const data = await get('/users', params);
        spinner.succeed(`Retrieved ${data.users?.length || 0} users`);
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch users');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  users
    .command('delete')
    .description('Delete current user')
    .action(async () => {
      const spinner = ora('Deleting user...').start();
      try {
        await del('/users/me');
        spinner.succeed('User deleted');
      } catch (error) {
        spinner.fail('Failed to delete user');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
