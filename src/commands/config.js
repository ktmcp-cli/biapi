/**
 * Configuration Commands
 *
 * Manage CLI configuration settings
 */

import chalk from 'chalk';
import { getAllConfig, setConfig, deleteConfig, clearConfig } from '../lib/config.js';

/**
 * Register configuration commands
 * @param {Command} program - Commander program instance
 */
export function registerConfigCommands(program) {
  const config = program
    .command('config')
    .description('Manage CLI configuration');

  config
    .command('list')
    .description('List all configuration values')
    .action(async () => {
      try {
        const configData = getAllConfig();
        console.log(chalk.cyan('Current configuration:'));

        // Mask sensitive values
        const masked = { ...configData };
        if (masked.accessToken) {
          masked.accessToken = masked.accessToken.substring(0, 10) + '***';
        }
        if (masked.clientSecret) {
          masked.clientSecret = masked.clientSecret.substring(0, 10) + '***';
        }

        console.log(JSON.stringify(masked, null, 2));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('set <key> <value>')
    .description('Set a configuration value')
    .action(async (key, value) => {
      try {
        setConfig(key, value);
        console.log(chalk.green(`✓ Set ${key} = ${value.substring(0, 20)}...`));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('get <key>')
    .description('Get a configuration value')
    .action(async (key) => {
      try {
        const value = getAllConfig()[key];
        if (value === undefined) {
          console.log(chalk.yellow(`Key "${key}" not found`));
        } else {
          console.log(value);
        }
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('delete <key>')
    .description('Delete a configuration value')
    .action(async (key) => {
      try {
        deleteConfig(key);
        console.log(chalk.green(`✓ Deleted ${key}`));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });

  config
    .command('clear')
    .description('Clear all configuration')
    .action(async () => {
      try {
        clearConfig();
        console.log(chalk.green('✓ Configuration cleared'));
      } catch (error) {
        console.error(chalk.red('Error:'), error.message);
        process.exit(1);
      }
    });
}
