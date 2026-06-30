# KisanSeva Platform - EC2 Deployment Guide

This guide is specifically designed for deploying the KisanSeva platform on an AWS EC2 instance (recommended: `t3.medium` or `t3.small`) using Docker and AWS best practices.

---

## 1. Initial EC2 Setup

Once you have created your EC2 instance (Ubuntu 22.04/24.04 recommended) and allowed HTTP (80) and HTTPS (443) traffic in the AWS Security Group, SSH into your server:

```bash
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-ip>
```

### Install Docker and Docker Compose
Run the following commands to install the necessary containerization tools:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install docker.io -y

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to the docker group (so you don't need 'sudo' for docker commands)
sudo usermod -aG docker $USER
```
*(Note: You will need to log out and log back in for the group change to take effect: `exit` then SSH back in).*

```bash
# Install Docker Compose
sudo apt install docker-compose-v2 -y
```

---

## 2. Configure Swap Space (CRITICAL FOR AWS)

Because the Google Lens AI scraping feature (Playwright/Chromium) requires significant memory spikes, adding a Swap File prevents the server from crashing due to Out Of Memory (OOM) errors.

```bash
# Create a 2GB swap file
sudo fallocate -l 2G /swapfile

# Set the correct permissions
sudo chmod 600 /swapfile

# Make it a swap file
sudo mkswap /swapfile

# Enable the swap file
sudo swapon /swapfile

# Make the swap permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 3. Clone Repository & Environment Setup

Now, bring your project code onto the server.

```bash
# Clone your repository (use HTTPS or SSH)
git clone <your-repo-url>
cd agrosetu
```

### Create the Environment File
Your `.env` file is excluded from Git for security. You must create it manually on the server.

```bash
nano .env
```

Paste your variables inside the file, for example:
```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
```
*(Press `Ctrl + X`, then `Y`, then `Enter` to save and exit).*

---

## 4. Build and Deploy

The `docker-compose.yml` file is pre-configured with memory limits and health checks to ensure a robust deployment.

```bash
# Build the containers (this will take a few minutes the first time)
docker compose build

# Start the application in detached mode
docker compose up -d
```

### Verify Deployment
You can check the status of your containers. Notice how the frontend waits for the backend to be `(healthy)`.

```bash
docker compose ps
```

To view the backend logs (useful for monitoring the AI responses):
```bash
docker compose logs -f backend
```

---

## 5. Security & Maintenance

1. **Firewall**: Ensure Port 8000 is **NOT** open in your AWS Security Group. Nginx (Port 80) proxies traffic internally to the backend, keeping your API secure from direct external access.
2. **Updates**: When you push new code to Git, pull the changes and rebuild:
   ```bash
   git pull origin main
   docker compose up -d --build
   ```
3. **SSL (Recommended Next Step)**: To use features like Voice Input and Geolocation, you will need HTTPS. You can set this up easily using Let's Encrypt (Certbot) for Nginx once you have mapped a domain name to your EC2 IP address.
