# Budgea CLI - AI Agent Guide

This document provides guidance for AI agents using the Budgea CLI to interact with banking and financial data APIs.

## Quick Start for Agents

The Budgea CLI is designed to be used directly by AI agents via bash commands. No MCP server or additional setup is required.

### Installation Check

```bash
# Check if CLI is installed
which biapi

# If not installed, install globally
npm install -g @ktmcp-cli/biapi
```

### Configuration

Set your access token before making API calls:

```bash
# Set access token
biapi config set accessToken YOUR_ACCESS_TOKEN

# Verify configuration
biapi config list
```

## Core Commands

### 1. Authentication

```bash
# Create temporary token (anonymous user)
biapi auth init --format json

# Generate JWT token (requires client credentials)
biapi auth jwt --user-id 123 --format json

# Revoke current token
biapi auth revoke
```

### 2. Banks

```bash
# List available banks
biapi banks list --limit 20 --format json

# Get specific bank with fields
biapi banks get 59 --expand fields --format json

# Search for a bank
biapi banks search "BNP" --format json
```

### 3. Users

```bash
# Get current user info
biapi users me --format json

# Get user with connections
biapi users me --expand connections --format json

# List all users (admin only)
biapi users list --format json
```

### 4. Connections

```bash
# List all connections
biapi connections list --format json

# List connections with accounts
biapi connections list --expand accounts --format json

# Get specific connection
biapi connections get 123 --format json

# Sync a connection
biapi connections sync 123

# Create new connection (requires JSON file)
echo '{
  "id_bank": 59,
  "login": "12345678",
  "password": "secret"
}' > /tmp/connection.json
biapi connections create -f /tmp/connection.json --format json
```

### 5. Accounts

```bash
# List all accounts
biapi accounts list --format json

# Get account with transactions
biapi accounts get 456 --expand transactions --format json

# Update account name
biapi accounts update 456 --name "Savings Account" --format json
```

### 6. Transactions

```bash
# List recent transactions
biapi transactions list --limit 100 --format json

# List transactions for specific account
biapi transactions list --account 456 --format json

# Filter by date range
biapi transactions list \
  --min-date 2024-01-01 \
  --max-date 2024-12-31 \
  --format json

# Get specific transaction
biapi transactions get 789 --format json

# Update transaction
biapi transactions update 789 \
  --comment "Grocery shopping" \
  --format json
```

### 7. Transfers (PSD2)

```bash
# List all transfers
biapi transfers list --format json

# Get specific transfer
biapi transfers get 101 --format json

# Create new transfer
biapi transfers create \
  --account 456 \
  --recipient 789 \
  --amount 100.00 \
  --label "Payment" \
  --format json

# Execute pending transfer
biapi transfers execute 101 --password "123456" --format json
```

## JSON Processing with jq

All commands support `--format json` for easy parsing:

```bash
# Extract account balances
biapi accounts list --format json | \
  jq -r '.accounts[] | "\(.name): \(.balance)"'

# Get total balance across all accounts
biapi accounts list --format json | \
  jq '[.accounts[].balance] | add'

# List transactions over $100
biapi transactions list --format json | \
  jq '.transactions[] | select(.value > 100)'

# Export to CSV
biapi transactions list --format json | \
  jq -r '.transactions[] | [.date, .wording, .value] | @csv'
```

## Common Patterns

### Check Account Balance

```bash
# Get all accounts with balances
biapi accounts list --format json | \
  jq '.accounts[] | {id, name, balance, currency: .currency.id}'
```

### Get Recent Transactions

```bash
# Last 30 days
biapi transactions list \
  --min-date $(date -d '30 days ago' +%Y-%m-%d) \
  --max-date $(date +%Y-%m-%d) \
  --format json
```

### Sync All Connections

```bash
# Trigger sync for all connections
for conn_id in $(biapi connections list --format json | jq -r '.connections[].id'); do
  echo "Syncing connection $conn_id..."
  biapi connections sync $conn_id
done
```

### Create Bank Transfer

```bash
# Create and execute transfer
TRANSFER_ID=$(biapi transfers create \
  --account 456 \
  --recipient 789 \
  --amount 50.00 \
  --label "Payment" \
  --format json | jq -r '.id')

biapi transfers execute $TRANSFER_ID --password "123456" --format json
```

## Error Handling

Commands exit with non-zero status on error. Check exit codes:

```bash
if biapi accounts get 123 --format json > /tmp/account.json 2>&1; then
  echo "Success"
  cat /tmp/account.json
else
  echo "Failed to fetch account"
  cat /tmp/account.json
  exit 1
fi
```

## Best Practices for Agents

1. **Always use `--format json`** for programmatic access
2. **Check exit codes** to detect failures
3. **Use environment variables** for credentials (not command-line args)
4. **Parse errors** from stderr
5. **Use jq** for JSON processing
6. **Handle rate limits** by checking error messages
7. **Cache bank lists** (they don't change often)
8. **Use date filters** to minimize data transfer

## Security Considerations

1. **Never log access tokens** in plain text
2. **Use environment variables** for secrets
3. **Clear sensitive data** after use
4. **Validate user input** before creating transfers
5. **Check transfer limits** before execution

## Environment Variables

```bash
# Set via environment (recommended for automation)
export BIAPI_ACCESS_TOKEN="your_token_here"
export BIAPI_BASE_URL="https://demo.biapi.pro/2.0"
export BIAPI_CLIENT_ID="your_client_id"
export BIAPI_CLIENT_SECRET="your_client_secret"

# Now all commands use these credentials
biapi users me --format json
```

## Limitations

- **PSD2 Compliance**: Some operations require proper authorization
- **Rate Limits**: API may rate limit requests
- **Connection Sync**: Syncs can take time to complete
- **Transfer Execution**: May require 2FA or bank password

## API Resources

The Budgea API follows this resource hierarchy:

```
User
├── Connections (bank credentials)
│   ├── Accounts (bank accounts)
│   │   ├── Transactions (account movements)
│   │   ├── Investments (securities)
│   │   └── Recipients (transfer recipients)
│   └── Subscriptions (provider subscriptions)
└── Transfers (payment orders)
```

## Sample Agent Workflow

```bash
#!/bin/bash
# Agent workflow: Get account summary

# 1. Set credentials
export BIAPI_ACCESS_TOKEN="$TOKEN"

# 2. Get user info
echo "Getting user info..."
biapi users me --format json > /tmp/user.json

# 3. List all accounts
echo "Fetching accounts..."
biapi accounts list --format json > /tmp/accounts.json

# 4. Calculate total balance
TOTAL=$(jq '[.accounts[].balance] | add' < /tmp/accounts.json)
echo "Total balance: $TOTAL"

# 5. Get recent transactions
echo "Fetching transactions..."
biapi transactions list \
  --min-date $(date -d '7 days ago' +%Y-%m-%d) \
  --format json > /tmp/transactions.json

# 6. Report
echo "Summary:"
jq -r '.accounts[] | "  \(.name): \(.formatted_balance)"' < /tmp/accounts.json
echo "Transactions last 7 days: $(jq '.transactions | length' < /tmp/transactions.json)"

# Clean up
rm /tmp/user.json /tmp/accounts.json /tmp/transactions.json
```

## Support

- GitHub Issues: https://github.com/ktmcp-cli/biapi/issues
- API Documentation: https://budgea.biapi.pro/2.0/doc/
- KTMCP Website: https://killthemcp.com
