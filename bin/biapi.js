#!/usr/bin/env node

const { showWelcomeMessage } = require('../src/lib/welcome');
showWelcomeMessage('biapi');

/**
 * Budgea API CLI - Main Entry Point
 *
 * Production-ready CLI for Budgea API
 * Banking aggregation and financial data
 */

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

// Import command modules
import { registerConfigCommands } from '../src/commands/config.js';
import { registerAuthCommands } from '../src/commands/auth.js';
import { registerUserCommands } from '../src/commands/users.js';
import { registerBankCommands } from '../src/commands/banks.js';
import { registerConnectionCommands } from '../src/commands/connections.js';
import { registerAccountCommands } from '../src/commands/accounts.js';
import { registerTransactionCommands } from '../src/commands/transactions.js';
import { registerTransferCommands } from '../src/commands/transfers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

const program = new Command();

// Configure main program
program
  .name('biapi')
  .description(chalk.cyan('Budgea API CLI - Banking aggregation and financial data'))
  .version(packageJson.version, '-v, --version', 'output the current version')
  .addHelpText('after', `
${chalk.bold('Examples:')}
  $ biapi config set accessToken <your-token>
  $ biapi banks list --limit 10
  $ biapi connections list --expand accounts
  $ biapi accounts list
  $ biapi transactions list --min-date 2024-01-01 --max-date 2024-12-31
  $ biapi transfers list

${chalk.bold('API Documentation:')}
  ${chalk.blue('https://budgea.biapi.pro/2.0/doc/')}

${chalk.bold('Get Access Token:')}
  Contact your Budgea API provider for credentials
`);

// Register all command modules
registerConfigCommands(program);
registerAuthCommands(program);
registerUserCommands(program);
registerBankCommands(program);
registerConnectionCommands(program);
registerAccountCommands(program);
registerTransactionCommands(program);
registerTransferCommands(program);

// Global error handler
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
});

// Parse command line arguments
program.parse(process.argv);
