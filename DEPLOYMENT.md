# Deployment Guide

Comprehensive guide for deploying the SaaS Multi-Tenant Platform to production.

## Prerequisites

- Docker & Docker Compose installed
- SSL/TLS certificates (Let's Encrypt recommended)
- Domain name configured
- VPS/Cloud server (AWS, DigitalOcean, Linode, etc.)
- Basic Linux/Unix knowledge

## Production Deployment Steps

### 1. Server Setup

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clone Repository

```bash
git clone https://github.com/prasad5682/saas-multi-tenant-app.git
cd saas-multi-tenant-app
```

### 3. Configure Environment

```bash
cp .env.example .env

# Edit .env with production values
vim .env
```

Update critical variables:
- `JWT_SECRET` - Use `openssl rand -base64 32`
- `DB_PASSWORD` - Strong password
- `NODE_ENV=production`
- `CORS_ORIGIN` - Your production domain

### 4. Setup SSL/TLS with Nginx Reverse Proxy

Create `nginx.conf`:

```nginx
upstream backend {
  server backend:5000;
}

upstream frontend {
  server frontend:3000;
}

server {
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl http2;
  server_name yourdomain.com www.yourdomain.com;

  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  location /api {
    proxy_pass http://backend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location / {
    proxy_pass http://frontend;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### 5. Update Docker Compose for Production

Update `docker-compose.yml` to use nginx and point to your domain.

### 6. Deploy

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Run migrations
docker-compose exec backend npm run migrate
```

### 7. Backup Strategy

```bash
# Daily database backup
0 2 * * * docker-compose exec -T db pg_dump -U saas_user saas_db > /backups/saas_db_$(date +\%Y\%m\%d).sql
```

### 8. Monitoring

Recommended monitoring tools:
- Prometheus + Grafana for metrics
- ELK Stack for logging
- Sentry for error tracking
- Uptime monitoring (Uptime Robot, StatusCake)

### 9. Scaling

For horizontal scaling:
- Use managed database (RDS, Cloud SQL)
- Deploy multiple backend instances
- Use load balancer (AWS ELB, nginx)
- Implement Redis for caching

### 10. Security Checklist

- [ ] Change all default passwords
- [ ] Enable firewall rules
- [ ] Setup fail2ban for SSH
- [ ] Enable HTTPS/SSL everywhere
- [ ] Regular security updates
- [ ] Database encryption at rest
- [ ] Implement WAF rules
- [ ] Setup rate limiting
- [ ] Enable audit logging
- [ ] Regular penetration testing

## Troubleshooting

### Container won't start
```bash
docker-compose logs service_name
```

### Database connection issues
```bash
docker-compose exec db psql -U saas_user -d saas_db
```

### High memory usage
```bash
docker stats
```

## Support

For deployment assistance, refer to the main README.md or contact support.
