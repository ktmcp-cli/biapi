/**
 * Accounts Commands
 *
 * Manage bank accounts within connections
 */

import chalk from 'chalk';
import ora from 'ora';
import { get, put, del, formatOutput } from '../lib/api.js';

/**
 * Register account commands
 * @param {Command} program - Commander program instance
 */
export function registerAccountCommands(program) {
  const accounts = program
    .command('accounts')
    .description('Manage bank accounts');

  accounts
    .command('list')
    .description('List all accounts')
    .option('--expand <resources>', 'Expand related resources (e.g., transactions)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching accounts...').start();
      try {
        const params = {};
        if (options.expand) {
          params.expand = options.expand;
        }

        const data = await get('/users/me/accounts', params);
        spinner.succeed(`Retrieved ${data.accounts?.length || 0} accounts`);
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch accounts');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  accounts
    .command('get <id>')
    .description('Get details of a specific account')
    .option('--expand <resources>', 'Expand related resources (e.g., transactions)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching account ${id}...`).start();
      try {
        const params = {};
        if (options.expand) {
          params.expand = options.expand;
        }

        const data = await get(`/users/me/accounts/${id}`, params);
        spinner.succeed('Account details retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch account');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  accounts
    .command('update <id>')
    .description('Update account settings')
    .option('--name <name>', 'Custom name for the account')
    .option('--disabled <bool>', 'Enable/disable account (true/false)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Updating account ${id}...`).start();
      try {
        const data = {};
        if (options.name) data.name = options.name;
        if (options.disabled !== undefined) data.disabled = options.disabled === 'true';

        const result = await put(`/users/me/accounts/${id}`, data);
        spinner.succeed('Account updated');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to update account');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  accounts
    .command('delete <id>')
    .description('Delete an account')
    .action(async (id) => {
      const spinner = ora(`Deleting account ${id}...`).start();
      try {
        await del(`/users/me/accounts/${id}`);
        spinner.succeed('Account deleted');
      } catch (error) {
        spinner.fail('Failed to delete account');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
