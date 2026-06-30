#!/bin/bash

echo "====================================="
echo "Initializing AgroSetu Project Setup"
echo "====================================="

# 1. Setup Backend
echo "[1/4] Setting up Python Backend..."
cd backend || exit 1
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 2. Install Playwright Browsers (for Google Lens integration)
echo "[2/4] Installing Playwright Browsers..."
playwright install chromium
playwright install-deps chromium

# 3. Setup Frontend
echo "[3/4] Setting up React Frontend..."
cd ../frontend || exit 1
npm install

# 4. Environment Variables
echo "[4/4] Checking Environment Configuration..."
cd ..
if [ ! -f ".env" ]; then
    echo "Creating a template .env file. Please fill in your API keys!"
    cat <<EOT > .env
# Playwright / Google Lens configuration
GOOGLE_EMAIL="your_email@gmail.com"
GOOGLE_PASSWORD="your_password"

# SambaNova (LLM) configuration
SAMBANOVA_API_KEY="your_api_key_here"

# Firebase frontend configuration
VITE_FIREBASE_API_KEY="your_key"
VITE_FIREBASE_AUTH_DOMAIN="your_domain"
VITE_FIREBASE_PROJECT_ID="your_project"
VITE_FIREBASE_STORAGE_BUCKET="your_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_id"
EOT
    echo "⚠️  IMPORTANT: Please edit the .env file with your real credentials."
else
    echo "✅ .env file already exists."
fi

# Make start.sh executable just in case
chmod +x start.sh

echo "====================================="
echo "Setup Complete! 🎉"
echo "You can now run the app using: ./start.sh"
echo "====================================="
