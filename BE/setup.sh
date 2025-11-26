#!/bin/bash

# Setup script for DATH_CNPM Backend
# This script automates the initial setup process

echo "🚀 Starting DATH_CNPM Backend Setup..."
echo "======================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file based on .env.example"
    echo ""
    echo "Example .env content:"
    echo "PORT=8080"
    echo "DATABASE_URL=mysql://root:password@localhost:3306/project1?schema=public"
    echo "CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@<your-cloud-name>"
    echo "IMAGE_SIZE=5"
    echo "MAIL_USER=your-email@gmail.com"
    echo "MAIL_PASS=your-app-password"
    echo ""
    echo "📖 See readme.md for detailed instructions"
    exit 1
fi

echo "✅ .env file found"

# Step 1: Install dependencies
echo ""
echo "📦 Step 1: Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Step 2: Database migration
echo ""
echo "🗄️ Step 2: Running database migration..."
npm run prisma:remigrate
if [ $? -eq 0 ]; then
    echo "✅ Database migration completed"
else
    echo "❌ Database migration failed"
    echo "💡 Make sure your database server is running and DATABASE_URL is correct"
    exit 1
fi

# Step 3: Database seeding
echo ""
echo "🌱 Step 3: Seeding database..."
npm run db:seed
if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Database seeding failed"
    echo "💡 Check your seeders and database connection"
    exit 1
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 You can now start the development server with:"
echo "   npm run dev"
echo ""
echo "📚 For more information, see readme.md"