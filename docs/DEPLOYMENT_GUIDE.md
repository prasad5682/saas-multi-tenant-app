# Deployment Guide

## Quick Start with Docker Compose

The application is containerized and can be deployed using Docker Compose.

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Git
- 2GB RAM minimum

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/prasad5682/saas-multi-tenant-app.git
cd saas-multi-tenant-app
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start the application**
```bash
docker-compose up -d
```

4. **Verify deployment**
```bash
curl http://localhost:5000/api/health
# Response: {"status": "ok"}
```

## Docker Compose Services

### Frontend Service
- **Image**: node:16-alpine + Vite
- **Port**: 3000
- **Volume**: ./frontend:/app
- **Command**: npm run dev

### Backend Service
- **Image**: node:16-alpine + Express
- **Port**: 5000
- **Volume**: ./backend:/app
- **Environment**: Database credentials, JWT secret
- **Command**: npm start

### PostgreSQL Database
- **Image**: postgres:13-alpine
- **Port**: 5432
- **Volume**: postgres_data:/var/lib/postgresql/data
- **Environment**: Database name, user, password

## Production Deployment

### AWS EC2 Deployment

1. **Launch EC2 Instance**
   - Ubuntu 20.04 LTS
   - t3.medium or larger
   - 20GB EBS volume
   - Security group allowing ports 80, 443, 5432

2. **Install Dependencies**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git curl
sudo usermod -aG docker ubuntu
```

3. **Clone and Configure**
```bash
cd /opt
sudo git clone https://github.com/prasad5682/saas-multi-tenant-app.git
cd saas-multi-tenant-app
sudo cp .env.example .env
sudo nano .env  # Update with production values
```

4. **Start Services**
```bash
sudo docker-compose -f docker-compose.yml up -d
```

### Environment Variables

**Backend (.env)**
```
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=saas_multi_tenant_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=24h
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

## Database Initialization

Database schema is automatically initialized on container startup.

To manually initialize:
```bash
docker-compose exec db psql -U postgres -d saas_multi_tenant_db < ./db/schema.sql
```

## Health Checks

### Check Backend Health
```bash
curl -X GET http://localhost:5000/api/health
```

### Check Database Connection
```bash
docker-compose exec db psql -U postgres -d saas_multi_tenant_db -c "SELECT 1"
```

### View Logs
```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Database only
docker-compose logs -f db
```

## Monitoring

### Application Metrics
- CPU usage: `docker stats`
- Memory usage: `docker stats`
- Container health: `docker-compose ps`

### Database Monitoring
```sql
SELECT datname, usename, count(*) FROM pg_stat_activity GROUP BY datname, usename;
```

## Scaling

### Horizontal Scaling
- Multiple backend instances behind Nginx load balancer
- Database read replicas for scaling reads
- Redis caching layer for session management

### Vertical Scaling
- Increase instance type (t3.medium → t3.large)
- Increase allocated memory/CPU in docker-compose
- Optimize database queries and indexes

## Backup & Recovery

### Automated Backups
```bash
# Backup script
#!/bin/bash
DATE=$(date +"%Y%m%d_%H%M%S")
docker-compose exec -T db pg_dump -U postgres saas_multi_tenant_db > backup_$DATE.sql
gzip backup_$DATE.sql
```

### Restore from Backup
```bash
gzip -d backup_YYYYMMDD_HHMMSS.sql.gz
docker-compose exec -T db psql -U postgres saas_multi_tenant_db < backup_YYYYMMDD_HHMMSS.sql
```

## SSL/TLS Configuration

### Using Certbot with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

Configure Nginx reverse proxy:
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

## Troubleshooting

### Port Already in Use
```bash
lsof -i :3000  # Check port 3000
kill -9 <PID>
```

### Database Connection Failed
```bash
docker-compose logs db  # Check database logs
docker-compose restart db
```

### Out of Memory
```bash
docker system prune -a  # Clean up unused containers/images
increase swap space or upgrade instance
```

## Maintenance

### Regular Tasks
- Check logs weekly
- Monitor disk usage
- Update security patches
- Verify backup integrity
- Test failover procedures

### Update Application
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

## Support
For deployment issues, contact the development team or refer to docker-compose.yml configuration.
