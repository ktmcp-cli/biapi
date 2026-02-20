# Budgea CLI - Project Structure

## Directory Layout

```
biapi/
├── bin/
│   └── biapi.js              # Main CLI entry point
├── src/
│   ├── lib/
│   │   ├── api.js            # HTTP client and API calls
│   │   ├── auth.js           # Authentication helpers
│   │   ├── config.js         # Configuration management
│   │   └── welcome.js        # Welcome message (CommonJS)
│   └── commands/
│       ├── config.js         # Configuration commands
│       ├── auth.js           # Authentication commands
│       ├── users.js          # User management commands
│       ├── banks.js          # Bank listing commands
│       ├── connections.js    # Connection management
│       ├── accounts.js       # Account management
│       ├── transactions.js   # Transaction management
│       └── transfers.js      # Transfer/payment commands
├── package.json              # Package configuration
├── .gitignore                # Git ignore rules
├── .env.example              # Environment variable template
├── LICENSE                   # MIT License
├── README.md                 # Main documentation
├── AGENT.md                  # AI Agent guide
├── banner.svg                # CLI banner graphic
└── STRUCTURE.md              # This file
```

## Command Coverage

### Top 15 Most Useful API Endpoints Implemented:

1. **Authentication** (`/auth/*`)
   - `biapi auth init` - Create temporary token
   - `biapi auth jwt` - Generate JWT token
   - `biapi auth revoke` - Revoke token

2. **Users** (`/users/*`)
   - `biapi users me` - Get current user
   - `biapi users list` - List all users
   - `biapi users delete` - Delete user

3. **Banks** (`/banks/*`)
   - `biapi banks list` - List available banks
   - `biapi banks get <id>` - Get bank details
   - `biapi banks search <query>` - Search banks

4. **Connections** (`/users/me/connections/*`)
   - `biapi connections list` - List connections
   - `biapi connections get <id>` - Get connection
   - `biapi connections create` - Add bank connection
   - `biapi connections update <id>` - Update connection
   - `biapi connections sync <id>` - Trigger sync
   - `biapi connections delete <id>` - Delete connection

5. **Accounts** (`/users/me/accounts/*`)
   - `biapi accounts list` - List all accounts
   - `biapi accounts get <id>` - Get account details
   - `biapi accounts update <id>` - Update account
   - `biapi accounts delete <id>` - Delete account

6. **Transactions** (`/users/me/transactions/*`)
   - `biapi transactions list` - List transactions
   - `biapi transactions get <id>` - Get transaction
   - `biapi transactions update <id>` - Update transaction
   - `biapi transactions delete <id>` - Delete transaction

7. **Transfers** (`/users/me/transfers/*`)
   - `biapi transfers list` - List transfers
   - `biapi transfers get <id>` - Get transfer
   - `biapi transfers create` - Create transfer
   - `biapi transfers execute <id>` - Execute transfer
   - `biapi transfers cancel <id>` - Cancel transfer

8. **Configuration**
   - `biapi config list` - Show config
   - `biapi config set <key> <value>` - Set config
   - `biapi config get <key>` - Get config value
   - `biapi config delete <key>` - Delete config
   - `biapi config clear` - Clear all config

## Technology Stack

- **Runtime**: Node.js >= 18
- **CLI Framework**: Commander.js
- **HTTP Client**: Axios
- **UI Elements**: Chalk (colors), Ora (spinners)
- **Configuration**: Conf (persistent storage)
- **Environment**: Dotenv

## Key Features

- ✅ Bearer token authentication
- ✅ JSON and pretty-print output
- ✅ File-based input for complex operations
- ✅ Progress indicators
- ✅ Error handling with descriptive messages
- ✅ Rate limit awareness
- ✅ Persistent configuration
- ✅ Environment variable support
- ✅ Complete API coverage for core features
- ✅ PSD2 payment initiation support

## Installation

```bash
npm install -g @ktmcp-cli/biapi
```

## Usage Examples

```bash
# Configure
biapi config set accessToken YOUR_TOKEN

# List banks
biapi banks list --limit 10

# Get user info
biapi users me --expand connections

# List accounts
biapi accounts list --format json

# Get transactions
biapi transactions list --min-date 2024-01-01 --max-date 2024-12-31

# Create transfer
biapi transfers create \
  --account 123 \
  --recipient 456 \
  --amount 100.00 \
  --label "Payment"
```

## API Resource Hierarchy

```
User
  ├── Connections (bank credentials)
  │     ├── Accounts (bank accounts)
  │     │     ├── Transactions
  │     │     ├── Investments
  │     │     └── Recipients
  │     └── Subscriptions
  └── Transfers (payment orders)
```

## Documentation

- **README.md**: Complete user guide
- **AGENT.md**: AI agent integration guide
- **API Docs**: https://budgea.biapi.pro/2.0/doc/

## License

MIT License - See LICENSE file
