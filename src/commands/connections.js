/**
 * Connections Commands
 *
 * Manage bank connections (credentials to banks/providers)
 */

import chalk from 'chalk';
import ora from 'ora';
import { get, post, put, del, formatOutput } from '../lib/api.js';
import { readFileSync } from 'fs';

/**
 * Register connection commands
 * @param {Command} program - Commander program instance
 */
export function registerConnectionCommands(program) {
  const connections = program
    .command('connections')
    .description('Manage bank connections');

  connections
    .command('list')
    .description('List all connections')
    .option('--expand <resources>', 'Expand related resources (e.g., accounts)', 'accounts')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Fetching connections...').start();
      try {
        const params = {};
        if (options.expand) {
          params.expand = options.expand;
        }

        const data = await get('/users/me/connections', params);
        spinner.succeed(`Retrieved ${data.connections?.length || 0} connections`);
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch connections');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  connections
    .command('get <id>')
    .description('Get details of a specific connection')
    .option('--expand <resources>', 'Expand related resources (e.g., accounts)')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Fetching connection ${id}...`).start();
      try {
        const params = {};
        if (options.expand) {
          params.expand = options.expand;
        }

        const data = await get(`/users/me/connections/${id}`, params);
        spinner.succeed('Connection details retrieved');
        console.log(formatOutput(data, options.format));
      } catch (error) {
        spinner.fail('Failed to fetch connection');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  connections
    .command('create')
    .description('Create a new bank connection')
    .requiredOption('-f, --file <path>', 'JSON file with connection data')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (options) => {
      const spinner = ora('Creating connection...').start();
      try {
        const data = JSON.parse(readFileSync(options.file, 'utf-8'));
        const result = await post('/users/me/connections', data);
        spinner.succeed('Connection created');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to create connection');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  connections
    .command('update <id>')
    .description('Update a connection')
    .requiredOption('-f, --file <path>', 'JSON file with update data')
    .option('--format <type>', 'Output format (json, pretty)', 'pretty')
    .action(async (id, options) => {
      const spinner = ora(`Updating connection ${id}...`).start();
      try {
        const data = JSON.parse(readFileSync(options.file, 'utf-8'));
        const result = await post(`/users/me/connections/${id}`, data);
        spinner.succeed('Connection updated');
        console.log(formatOutput(result, options.format));
      } catch (error) {
        spinner.fail('Failed to update connection');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  connections
    .command('delete <id>')
    .description('Delete a connection')
    .action(async (id) => {
      const spinner = ora(`Deleting connection ${id}...`).start();
      try {
        await del(`/users/me/connections/${id}`);
        spinner.succeed('Connection deleted');
      } catch (error) {
        spinner.fail('Failed to delete connection');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  connections
    .command('sync <id>')
    .description('Trigger synchronization for a connection')
    .action(async (id) => {
      const spinner = ora(`Syncing connection ${id}...`).start();
      try {
        const result = await put(`/users/me/connections/${id}`, {});
        spinner.succeed('Connection sync triggered');
        console.log(formatOutput(result, 'json'));
      } catch (error) {
        spinner.fail('Failed to sync connection');
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
