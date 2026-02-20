/**
 * Transfers Commands
 *
 * Manage bank transfers (requires PSD2 authorization)
 */

import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, del, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

/**
 * Register transfer commands
 * @param {Command} program - Commander program instance
 */
export function registerTransferCommands(program) {
  const transfers = program
    .command('transfers')
    .description('Manage bank transfers');

  transfers
    .command('list')
    .description('List all transfers')
    .option('--limit <number>', 'Limit number of results', '50')
    .option('--offset <number>', 'Offset for pagination', '0')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching transfers...').start();
      try {
        const params = {
          limit: parseInt(options.limit),
          offset: parseInt(options.offset),
        };

        const data = await get('/users/me/transfers', params);
        spinner.succeed(`Retrieved ${data.transfers?.length || 0} transfers`);
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch transfers');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  transfers
    .command('get <id>')
    .description('Get details of a specific transfer')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching transfer ${id}...`).start();
      try {
        const data = await get(`/users/me/transfers/${id}`);
        spinner.succeed('Transfer details retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch transfer');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  transfers
    .command('create')
    .description('Create a new transfer')
    .requiredOption('--account <id>', 'Source account ID')
    .requiredOption('--recipient <id>', 'Recipient ID')
    .requiredOption('--amount <amount>', 'Transfer amount')
    .requiredOption('--label <text>', 'Transfer label')
    .option('--exec-date <date>', 'Execution date (YYYY-MM-DD)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating transfer...').start();
      try {
        const data = {
          amount: parseFloat(options.amount),
          label: options.label,
        };

        if (options.execDate) data.exec_date = options.execDate;

        const result = await post(
          `/users/me/accounts/${options.account}/recipients/${options.recipient}/transfers`,
          data
        );
        spinner.succeed('Transfer created');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to create transfer');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  transfers
    .command('execute <id>')
    .description('Execute a pending transfer')
    .option('--password <pwd>', 'Bank password (if required)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Executing transfer ${id}...`).start();
      try {
        const data = { validated: true };
        if (options.password) data.password = options.password;

        const result = await put(`/users/me/transfers/${id}`, data);
        spinner.succeed('Transfer executed');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to execute transfer');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  transfers
    .command('cancel <id>')
    .description('Cancel a transfer')
    .action(async (id) => {
      const spinner = ora(`Canceling transfer ${id}...`).start();
      try {
        await del(`/users/me/transfers/${id}`);
        spinner.succeed('Transfer canceled');
      } catch (error) {
        spinner.fail('Failed to cancel transfer');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
