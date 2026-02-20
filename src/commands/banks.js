/**
 * Banks Commands
 *
 * List and query available banks/connectors
 */

import chalk from 'chalk';
import ora from 'ora';
import { get, formatOutput } from '../lib/api.js';

/**
 * Register bank commands
 * @param {Command} program - Commander program instance
 */
export function registerBankCommands(program) {
  const banks = program
    .command('banks')
    .description('List and query available banks');

  banks
    .command('list')
    .description('List all available banks')
    .option('--limit <number>', 'Limit number of results', '50')
    .option('--offset <number>', 'Offset for pagination', '0')
    .option('--expand <resources>', 'Expand related resources (e.g., fields)', 'fields')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching banks...').start();
      try {
        const params = {
          limit: parseInt(options.limit),
          offset: parseInt(options.offset),
        };

        if (options.expand) {
          params.expand = options.expand;
        }

        const data = await get('/banks', params);
        spinner.succeed(`Retrieved ${data.banks?.length || 0} banks`);
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch banks');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  banks
    .command('get <id>')
    .description('Get details of a specific bank')
    .option('--expand <resources>', 'Expand related resources (e.g., fields)', 'fields')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching bank ${id}...`).start();
      try {
        const params = {};
        if (options.expand) {
          params.expand = options.expand;
        }

        const data = await get(`/banks/${id}`, params);
        spinner.succeed('Bank details retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch bank details');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  banks
    .command('search <query>')
    .description('Search banks by name')
    .option('--limit <number>', 'Limit number of results', '20')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (query, options) => {
      const spinner = ora(`Searching banks for "${query}"...`).start();
      try {
        const params = {
          search: query,
          limit: parseInt(options.limit),
        };

        const data = await get('/banks', params);
        spinner.succeed(`Found ${data.banks?.length || 0} banks`);
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to search banks');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
