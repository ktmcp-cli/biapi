/**
 * Authentication Module
 *
 * Handles Bearer token authentication for Budgea API
 */

import { getAccessToken } from './config.js';

/**
 * Get authentication headers for API requests
 * @returns {Object} Headers object with Bearer token
 * @throws {Error} If access token is not configured
 */
export function getAuthHeaders() {
  const accessToken = getAccessToken();

  return {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
}

/**
 * Validate access token format
 * @param {string} token - Access token to validate
 * @returns {boolean} True if format is valid
 */
export function validateTokenFormat(token) {
  // Budgea API tokens are typically long alphanumeric strings
  return typeof token === 'string' && token.length >= 20;
}
