# Nginx + Dynu Deployment Guide

## Overview
Deploying Quran Lights Web application on your PC using nginx as reverse proxy with Dynu dynamic DNS for external access.

## Architecture
```
Internet → Dynu DNS → Your PC → Nginx → Frontend/Backend/Auth Services
```

## Prerequisites

### 1. Dynu Setup
- [ ] Sign up at [dynu.com](https://www.dynu.com)
- [ ] Create a free subdomain (e.g., `quranlights.dynu.net`)
- [ ] Download Dynu client for your OS
- [ ] Configure Dynu client to update your IP automatically

### 2. Router Configuration
- [ ] Access your router admin panel (usually `192.168.1.1`)
- [ ] Forward port 80 (HTTP) to your PC's local IP
- [ ] Forward port 443 (HTTPS) to your PC's local IP
- [ ] Set your PC's IP as static in router DHCP settings

### 3. PC Setup
- [ ] Install nginx
- [ ] Install Node.js and npm
- [ ] Install PM2 for process management
- [ ] Configure firewall to allow ports 80, 443, 3000, 3001, 3002

## Installation Steps

### Step 1: Install Required Software

**Ubuntu/Debian:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install nginx
sudo apt install nginx -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

**Windows:**
```bash
# Install nginx for Windows
# Download from: http://nginx.org/en/download.html

# Install Node.js from: https://nodejs.org/

# Install PM2 globally
npm install -g pm2
```

### Step 2: Project Structure on PC

```bash
# Create project directory
mkdir -p /home/user/quran-lights-web
cd /home/user/quran-lights-web

# Clone your repository
git clone https://github.com/your-username/quran-lights-web.git .

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ../auth-microservice && npm install
```

### Step 3: Nginx Configuration

**Create nginx configuration file:**
```bash
sudo nano /etc/nginx/sites-available/quran-lights
```

**Configuration content:**
```nginx
# Upstream definitions
upstream frontend {
    server 127.0.0.1:3001;
}

upstream backend {
    server 127.0.0.1:3000;
}

upstream auth-service {
    server 127.0.0.1:3002;
}

# HTTP server (redirect to HTTPS)
server {
    listen 80;
    server_name your-domain.dynu.net;
    
    # Redirect all HTTP traffic to HTTPS
    return 301 https://$server_name$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name your-domain.dynu.net;
    
    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.dynu.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.dynu.net/privkey.pem;
    
    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend (React app)
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Handle React Router
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials true always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin $http_origin;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization";
            add_header Access-Control-Allow-Credentials true;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
    }
    
    # Auth microservice
    location /auth/ {
        proxy_pass http://auth-service;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin $http_origin always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials true always;
    }
    
    # Health check endpoint
    location /health {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files (if needed)
    location /static/ {
        alias /home/user/quran-lights-web/frontend/dist/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
```

### Step 4: Enable Nginx Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/quran-lights /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Step 5: SSL Certificate Setup

```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.dynu.net

# Start nginx
sudo systemctl start nginx

# Test automatic renewal
sudo certbot renew --dry-run
```

### Step 6: PM2 Configuration

**Create ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: 'quran-lights-frontend',
      cwd: '/home/user/quran-lights-web/frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'quran-lights-backend',
      cwd: '/home/user/quran-lights-web/backend',
      script: 'src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        FRONTEND_URL: 'https://your-domain.dynu.net',
        AUTH_MICROSERVICE_URL: 'http://localhost:3002'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'quran-lights-auth',
      cwd: '/home/user/quran-lights-web/auth-microservice',
      script: 'src/server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
```

### Step 7: Environment Configuration

**frontend/.env.production:**
```env
VITE_API_URL=https://your-domain.dynu.net/api
VITE_AUTH_URL=https://your-domain.dynu.net/auth
VITE_FIREBASE_ENV=prod
```

**backend/.env.production:**
```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.dynu.net
AUTH_MICROSERVICE_URL=http://localhost:3002
DATABASE_URL=mongodb://localhost:27017/quran_lights
JWT_SECRET=your-secure-secret-key
```

### Step 8: Startup Scripts

**Create startup script:**
```bash
# Create startup script
sudo nano /home/user/start-quran-lights.sh
```

**Script content:**
```bash
#!/bin/bash

# Navigate to project directory
cd /home/user/quran-lights-web

# Build frontend
cd frontend
npm run build
cd ..

# Start all services with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

**Make script executable:**
```bash
chmod +x /home/user/start-quran-lights.sh
```

### Step 9: Monitoring and Logs

**PM2 monitoring:**
```bash
# View all processes
pm2 list

# Monitor processes
pm2 monit

# View logs
pm2 logs

# View specific service logs
pm2 logs quran-lights-frontend
pm2 logs quran-lights-backend
pm2 logs quran-lights-auth
```

**Nginx logs:**
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## Security Considerations

### 1. Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Regular Updates
```bash
# Create update script
sudo nano /home/user/update-quran-lights.sh
```

**Update script:**
```bash
#!/bin/bash

# Update system
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
cd /home/user/quran-lights-web
npm update

# Restart services
pm2 restart all

# Renew SSL certificate
sudo certbot renew

# Reload nginx
sudo systemctl reload nginx
```

### 3. Backup Strategy
```bash
# Create backup script
sudo nano /home/user/backup-quran-lights.sh
```

**Backup script:**
```bash
#!/bin/bash

BACKUP_DIR="/home/user/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup project files
tar -czf $BACKUP_DIR/quran-lights-$DATE.tar.gz /home/user/quran-lights-web

# Backup database (if using MongoDB)
mongodump --out $BACKUP_DIR/mongodb-$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "mongodb-*" -mtime +7 -exec rm -rf {} \;
```

## Troubleshooting

### Common Issues:

1. **Port already in use:**
```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000

# Kill the process
sudo kill -9 <PID>
```

2. **Nginx configuration error:**
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

3. **SSL certificate issues:**
```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew
```

4. **PM2 process not starting:**
```bash
# Check PM2 logs
pm2 logs

# Restart all processes
pm2 restart all
```

## Performance Optimization

### 1. Nginx Caching
Add to nginx configuration:
```nginx
# Cache static files
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 2. Gzip Compression
Already included in the configuration above.

### 3. Database Optimization
```bash
# If using MongoDB, create indexes
mongo quran_lights --eval "db.users.createIndex({email: 1})"
```

## Monitoring Setup

### 1. Basic Monitoring Script
```bash
# Create monitoring script
sudo nano /home/user/monitor-quran-lights.sh
```

**Monitoring script:**
```bash
#!/bin/bash

# Check if services are running
if ! pm2 list | grep -q "quran-lights-frontend"; then
    echo "Frontend is down, restarting..."
    pm2 restart quran-lights-frontend
fi

if ! pm2 list | grep -q "quran-lights-backend"; then
    echo "Backend is down, restarting..."
    pm2 restart quran-lights-backend
fi

if ! pm2 list | grep -q "quran-lights-auth"; then
    echo "Auth service is down, restarting..."
    pm2 restart quran-lights-auth
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo "Warning: Disk usage is ${DISK_USAGE}%"
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
    echo "Warning: Memory usage is ${MEMORY_USAGE}%"
fi
```

### 2. Setup Cron Job
```bash
# Add to crontab
crontab -e

# Add this line to run monitoring every 5 minutes
*/5 * * * * /home/user/monitor-quran-lights.sh >> /home/user/monitor.log 2>&1
```

## Final Checklist

- [ ] Dynu domain configured and updating
- [ ] Router port forwarding set up
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained
- [ ] PM2 installed and configured
- [ ] All services running
- [ ] Firewall configured
- [ ] Backup strategy implemented
- [ ] Monitoring set up
- [ ] Tested from external network

## Benefits of This Setup

1. **Cost Effective**: Free hosting on your PC
2. **Full Control**: Complete control over your infrastructure
3. **Scalable**: Easy to add more services
4. **Secure**: SSL encryption and proper security headers
5. **Reliable**: PM2 process management with auto-restart
6. **Monitored**: Built-in monitoring and logging

This setup will give you a professional-grade deployment that's both cost-effective and fully under your control! 