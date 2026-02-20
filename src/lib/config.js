/**
 * Configuration Management
 *
 * Handles API token storage and configuration using conf package
 */

import Conf from 'conf';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

const config = new Conf({
  projectName: 'biapi-cli',
  defaults: {
    accessToken: process.env.BIAPI_ACCESS_TOKEN || '',
    baseUrl: process.env.BIAPI_BASE_URL || 'https://demo.biapi.pro/2.0',
    domain: process.env.BIAPI_DOMAIN || 'demo',
    clientId: process.env.BIAPI_CLIENT_ID || '',
    clientSecret: process.env.BIAPI_CLIENT_SECRET || '',
  },
});

/**
 * Get configuration value
 * @param {string} key - Configuration key
 * @returns {*} Configuration value
 */
export function getConfig(key) {
  return config.get(key);
}

/**
 * Set configuration value
 * @param {string} key - Configuration key
 * @param {*} value - Configuration value
 */
export function setConfig(key, value) {
  config.set(key, value);
}

/**
 * Get all configuration
 * @returns {Object} All configuration values
 */
export function getAllConfig() {
  return config.store;
}

/**
 * Delete configuration value
 * @param {string} key - Configuration key
 */
export function deleteConfig(key) {
  config.delete(key);
}

/**
 * Clear all configuration
 */
export function clearConfig() {
  config.clear();
}

/**
 * Get access token from config or environment
 * @returns {string} Access token
 * @throws {Error} If access token is not configured
 */
export function getAccessToken() {
  const accessToken = getConfig('accessToken') || process.env.BIAPI_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error(
      'Access token not configured. Set it with: biapi config set accessToken <your-token>\n' +
      'Or set BIAPI_ACCESS_TOKEN environment variable.\n' +
      'Get your token from your Budgea API provider.'
    );
  }

  return accessToken;
}

/**
 * Get base URL from config or environment
 * @returns {string} Base URL
 */
export function getBaseUrl() {
  return getConfig('baseUrl') || process.env.BIAPI_BASE_URL || 'https://demo.biapi.pro/2.0';
}

/**
 * Get client credentials
 * @returns {Object} Client ID and secret
 */
export function getClientCredentials() {
  return {
    clientId: getConfig('clientId') || process.env.BIAPI_CLIENT_ID,
    clientSecret: getConfig('clientSecret') || process.env.BIAPI_CLIENT_SECRET,
  };
}
