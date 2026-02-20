#!/bin/bash
# Quick install script for Budgea CLI

set -e

echo "Installing Budgea CLI (@ktmcp-cli/biapi)..."
echo ""

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Error: Node.js version must be >= 18.0.0"
    echo "Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Link for global use
echo "Linking CLI globally..."
npm link

echo ""
echo "✓ Installation complete!"
echo ""
echo "Configure your access token:"
echo "  biapi config set accessToken YOUR_TOKEN"
echo ""
echo "Get started:"
echo "  biapi --help"
echo "  biapi banks list"
echo "  biapi users me"
echo ""
