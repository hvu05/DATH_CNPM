#!/bin/bash

# Quick start script for DATH_CNPM Backend
# This script starts the development server

echo "🚀 Starting DATH_CNPM Backend Development Server..."
echo "===================================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found!"
    echo "Please run './setup.sh' first for initial setup"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file based on .env.example"
    exit 1
fi

echo "✅ Environment looks good"
echo "🔥 Starting development server..."
echo ""

npm run dev