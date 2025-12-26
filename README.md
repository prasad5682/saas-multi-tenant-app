# SaaS Multi-Tenant Platform

Production-ready multi-tenant SaaS platform with complete data isolation, JWT authentication, and subscription management. Includes 19 REST APIs, React frontend, PostgreSQL database, and Docker containerization.

## Features

- **Multi-Tenant Architecture**: Complete data isolation between tenants
- **19 REST APIs**: Comprehensive backend with user, tenant, and subscription management
- **JWT Authentication**: Secure token-based authentication
- **React Frontend**: 6-page admin dashboard with all major features
- **PostgreSQL Database**: Robust relational database with migrations
- **Docker Containerization**: Complete Docker setup with compose file
- **Subscription Management**: Built-in subscription and billing features
- **Audit Logging**: Complete audit trail for compliance

## Project Structure

```
├── backend/              # Node.js Express backend
│   ├── src/
│   │   ├── index.js     # Main server with 19 APIs
│   │   └── db.js        # Database configuration
│   ├── package.json
│   └── Dockerfile
├── frontend/            # React frontend
│   ├── App.jsx         # Main app component
│   ├── pages/          # 6 pages (Dashboard, Users, Profiles, Settings, Logs, Analytics)
│   ├── package.json
│   └── Dockerfile
├── db/
│   └── migrations/     # Database migrations
├── docker-compose.yml  # Container orchestration
└── submission.json     # Test credentials
```

## Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- PostgreSQL 14+ (for local development)

### Quick Start with Docker

```bash
docker-compose up
```

Services will be available at:
- Backend API: http://localhost:5000
- Frontend: http://localhost:3000
- PostgreSQL: localhost:5432

### API Endpoints (19 APIs)

**Authentication**
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- POST /api/auth/refresh - Refresh token

**Tenants**
- GET /api/tenants - List all tenants
- POST /api/tenants - Create tenant
- GET /api/tenants/:id - Get tenant
- PUT /api/tenants/:id - Update tenant
- DELETE /api/tenants/:id - Delete tenant

**Users**
- GET /api/users - List users
- POST /api/users - Create user
- GET /api/users/:id - Get user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

**Subscriptions**
- GET /api/subscriptions - List subscriptions
- POST /api/subscriptions - Create subscription
- GET /api/subscriptions/:id - Get subscription
- PUT /api/subscriptions/:id - Update subscription
- DELETE /api/subscriptions/:id - Delete subscription

**System**
- GET /api/stats - System statistics
- GET /api/health - Health check

## Frontend Pages

1. **Dashboard** - Key metrics and overview
2. **Users Management** - User management interface
3. **Profiles** - User profiles management
4. **Settings** - System configuration
5. **Logs** - Audit and system logs
6. **Analytics** - Platform analytics

## Database Schema

- `tenants` - Tenant information
- `users` - User accounts with tenant isolation
- `subscriptions` - Subscription plans and status
- `audit_logs` - Complete audit trail

## Test Credentials

See `submission.json` for test credentials

## Environment Variables

```
DB_HOST=db
DB_PORT=5432
DB_USER=saas_user
DB_PASSWORD=secure_password
DB_NAME=saas_db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

## Development

### Backend Development
```bash
cd backend
npm install
npm start
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## Production Deployment

1. Update docker-compose.yml with your production settings
2. Run `docker-compose up -d`
3. Configure SSL/TLS termination
4. Set up monitoring and logging
5. Configure database backups

## API Documentation

All endpoints require Bearer token in Authorization header for authenticated routes:
```
Authorization: Bearer <jwt_token>
```

## License

MIT

## Support

For support, contact the development team or file an issue in the repository.
