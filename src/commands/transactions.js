/**
 * Transactions Commands
 *
 * Manage bank transactions
 */

import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, del, formatOutput } from '../lib/api.js';

/**
 * Register transaction commands
 * @param {Command} program - Commander program instance
 */
export function registerTransactionCommands(program) {
  const transactions = program
    .command('transactions')
    .description('Manage bank transactions');

  transactions
    .command('list')
    .description('List all transactions')
    .option('--account <id>', 'Filter by account ID')
    .option('--min-date <date>', 'Minimum date (YYYY-MM-DD)')
    .option('--max-date <date>', 'Maximum date (YYYY-MM-DD)')
    .option('--limit <number>', 'Limit number of results', '100')
    .option('--offset <number>', 'Offset for pagination', '0')
    .option('--expand <resources>', 'Expand related resources (e.g., category)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching transactions...').start();
      try {
        const params = {
          limit: parseInt(options.limit),
          offset: parseInt(options.offset),
        };

        if (options.minDate) params.min_date = options.minDate;
        if (options.maxDate) params.max_date = options.maxDate;
        if (options.expand) params.expand = options.expand;

        const endpoint = options.account
          ? `/users/me/accounts/${options.account}/transactions`
          : '/users/me/transactions';

        const data = await get(endpoint, params);
        spinner.succeed(`Retrieved ${data.transactions?.length || 0} transactions`);
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch transactions');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  transactions
    .command('get <id>')
    .description('Get details of a specific transaction')
    .option('--expand <resources>', 'Expand related resources (e.g., category)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching transaction ${id}...`).start();
      try {
        const params = {};
        if (options.expand) {
          params.expand = options.expand;
        }

        const data = await get(`/users/me/transactions/${id}`, params);
        spinner.succeed('Transaction details retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch transaction');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  transactions
    .command('update <id>')
    .description('Update a transaction')
    .option('--comment <text>', 'Add/update comment')
    .option('--category <id>', 'Set category ID')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Updating transaction ${id}...`).start();
      try {
        const data = {};
        if (options.comment !== undefined) data.comment = options.comment;
        if (options.category) data.id_category = parseInt(options.category);

        const result = await put(`/users/me/transactions/${id}`, data);
        spinner.succeed('Transaction updated');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to update transaction');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  transactions
    .command('delete <id>')
    .description('Delete a transaction')
    .action(async (id) => {
      const spinner = ora(`Deleting transaction ${id}...`).start();
      try {
        await del(`/users/me/transactions/${id}`);
        spinner.succeed('Transaction deleted');
      } catch (error) {
        spinner.fail('Failed to delete transaction');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
