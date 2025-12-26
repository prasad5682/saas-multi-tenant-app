# System Architecture

## System Architecture Overview

The application uses a 3-tier containerized architecture with Docker:

**Frontend Tier (Port 3000):**
- React.js application with Vite bundler
- User interface for dashboard, projects, tasks, users management
- Responsive design for desktop and mobile

**Backend API Tier (Port 5000):**
- Node.js + Express.js REST API server
- 19 endpoints for authentication, tenant, user, project, task management
- JWT token validation and multi-tenant data isolation
- Audit logging for all operations

**Database Tier (Port 5432):**
- PostgreSQL relational database
- 5 core tables: tenants, users, projects, tasks, audit_logs
- Complete data isolation with tenant_id foreign keys

## Database Schema

**tenants:** id, name, subdomain (unique), status, subscription_plan, max_users, max_projects, created_at

**users:** id, tenant_id (FK), email, password_hash, full_name, role, is_active, created_at

**projects:** id, tenant_id (FK), name, description, status, created_by (FK), created_at

**tasks:** id, project_id (FK), tenant_id (FK), title, description, status, priority, assigned_to (FK), due_date, created_at

**audit_logs:** id, tenant_id (FK), user_id (FK), action, entity_type, entity_id, ip_address, created_at

## API Architecture (19 Endpoints)

### Authentication (4): register-tenant, login, get-user, logout
### Tenants (3): get-tenant, update-tenant, list-tenants
### Users (3): add-user, list-users, update-user, delete-user  
### Projects (3): create-project, list-projects, update-project, delete-project
### Tasks (4): create-task, list-tasks, update-task, update-status
### System (2): health-check, get-stats

## Security Architecture

- JWT tokens with 24-hour expiry
- Bcrypt password hashing
- Tenant isolation via tenant_id on all queries
- Role-based access control (super_admin, tenant_admin, user)
- Audit trail for compliance and security
- HTTPS/TLS in production
- CORS configured for frontend domain

## Data Flow Architecture

### User Registration & Authentication Flow
1. User registers as tenant admin via register-tenant endpoint
2. System creates tenant record with unique subdomain
3. JWT token issued with 24-hour expiry
4. Token used for subsequent API requests
5. JWT validation on protected endpoints via middleware

### Multi-Tenant Data Isolation
- All queries filtered by tenant_id from JWT token
- Row-level security prevents cross-tenant access
- Database foreign keys enforce referential integrity
- Audit logs track all access attempts

## Deployment Architecture

### Docker Containerization
- Frontend container: Node.js + Vite (port 3000)
- Backend container: Node.js + Express (port 5000)
- Database container: PostgreSQL (port 5432)
- All containers share internal network

### Environment Configuration
- .env file contains database credentials
- Environment variables for API keys and secrets
- Docker Compose for orchestration
- Health-check endpoints for monitoring

## Performance Considerations

- Database indexing on tenant_id, user_id for fast queries
- JWT validation caching to reduce database calls
- Connection pooling for database connections
- Nginx reverse proxy for frontend delivery
- Gzip compression for API responses

## Scalability Strategy

### Horizontal Scaling
- Multiple backend instances behind load balancer
- Database replication for read scaling
- Redis caching layer for session management
- CDN for static frontend assets

### Vertical Scaling
- Optimized database queries with proper indexing
- Query pagination to reduce memory usage
- Request rate limiting per tenant
- Batch operations for bulk data processing
