API_SETUP.md  # API Setup and Integration Guide

## Backend API Endpoints (19 APIs)

### Authentication Endpoints (4)
- `POST /api/auth/register-tenant` - Register new tenant with admin user
- `POST /api/auth/login` - Login user and get JWT token
- `POST /api/auth/logout` - Logout (token-based)
- `GET /api/auth/me` - Get current authenticated user info

### Tenant Management (4)
- `GET /api/tenants` - List all tenants (superadmin only, paginated)
- `GET /api/tenants/:id` - Get single tenant details
- `PUT /api/tenants/:id` - Update tenant info (superadmin only)
- `DELETE /api/tenants/:id` - Delete tenant (superadmin only)

### User Management (5)
- `POST /api/users/:tenantId/users` - Add user to tenant
- `GET /api/users/:tenantId/users` - List users in tenant
- `GET /api/users/:id` - Get single user details
- `PUT /api/users/:id` - Update user info
- `DELETE /api/users/:id` - Delete user

### Project Management (3)
- `POST /api/projects` - Create new project
- `GET /api/projects` - List projects (with pagination)
- `DELETE /api/projects/:id` - Delete project

### Task Management (2)
- `POST /api/projects/:projectId/tasks` - Create task in project
- `GET /api/projects/:projectId/tasks` - List tasks with filtering (status, priority)

### System Endpoints (2)
- `GET /api/health` - Health check
- `GET /api/stats` - System statistics

## Authentication

All API endpoints except auth endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Request/Response Format

### Register Tenant
```json
POST /api/auth/register-tenant
{
  "tenant_name": "ACME Corp",
  "admin_name": "John Doe",
  "admin_email": "john@acme.com",
  "password": "secure_password"
}

Response: 201 Created
{
  "message": "Tenant registered successfully",
  "token": "eyJhbGc...",
  "tenant": { "id": 1, "name": "ACME Corp" }
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@acme.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "token": "eyJhbGc...",
  "user": { "id": 1, "name": "John Doe", "email": "john@acme.com", "role": "superadmin" }
}
```

### Create Project
```json
POST /api/projects
Headers: Authorization: Bearer <token>
{
  "name": "Q1 2025 Initiative",
  "description": "Project description"
}

Response: 201 Created
{
  "id": 1,
  "name": "Q1 2025 Initiative",
  "description": "Project description",
  "created_at": "2025-01-01T10:00:00Z"
}
```

### Create Task
```json
POST /api/projects/1/tasks
Headers: Authorization: Bearer <token>
{
  "title": "Complete API development",
  "description": "Develop and test all 19 APIs",
  "status": "pending",
  "priority": "high",
  "due_date": "2025-02-01"
}

Response: 201 Created
{
  "id": 1,
  "project_id": 1,
  "title": "Complete API development",
  "status": "pending",
  "priority": "high",
  "created_at": "2025-01-01T10:00:00Z"
}
```

### List Projects
```json
GET /api/projects?page=1&limit=10
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "data": [{ "id": 1, "name": "Project 1", ... }],
  "pagination": { "page": 1, "limit": 10, "total": 25, "pages": 3 }
}
```

### List Tasks with Filter
```json
GET /api/projects/1/tasks?status=pending&priority=high
Headers: Authorization: Bearer <token>

Response: 200 OK
{
  "data": [
    { "id": 1, "title": "Task 1", "status": "pending", "priority": "high" }
  ]
}
```

## Error Responses

### 401 Unauthorized
```json
{ "error": "No token provided" }
{ "error": "Invalid token" }
```

### 403 Forbidden
```json
{ "error": "Super admin access required" }
```

### 400 Bad Request
```json
{ "error": "Missing required fields" }
```

### 404 Not Found
```json
{ "error": "Project not found" }
```

## Multi-Tenancy

- Each tenant has complete data isolation
- Tenant ID is embedded in JWT token
- All queries automatically filter by tenant_id
- Users can only see their own tenant data

## Rate Limiting

- Global rate limit: 100 requests per 15 minutes
- Applies to all endpoints

## Database Tables

- `tenants` - Tenant information
- `users` - User accounts with tenant isolation  
- `projects` - Project information
- `tasks` - Task management
- `audit_logs` - Audit trail

## Environment Variables

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=saas_user
DB_PASSWORD=password
DB_NAME=saas_db
JWT_SECRET=your_secret_key
PORT=5000
```
