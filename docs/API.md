# API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow standard JSON format:
```json
{
  "success": true,
  "data": {},
  "error": null
}
```

## Endpoints

### Authentication Endpoints

#### POST /auth/register-tenant
Register a new tenant
- **Body**: `{ name, email, password }`
- **Response**: `{ tenant, user, token }`

#### POST /auth/login
Login user
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

#### GET /auth/get-user
Get current user info (Protected)
- **Response**: `{ user }`

#### POST /auth/logout
Logout user (Protected)
- **Response**: `{ message }`

### Tenant Endpoints

#### GET /tenants/:id
Get tenant details (Protected)
- **Response**: `{ tenant }`

#### PUT /tenants/:id
Update tenant info (Protected)
- **Body**: `{ name, subscription_plan, max_users, max_projects }`
- **Response**: `{ tenant }`

#### GET /tenants
List all tenants (Protected)
- **Query**: `{ limit, offset }`
- **Response**: `{ tenants, total }`

### User Endpoints

#### POST /users
Add new user to tenant (Protected)
- **Body**: `{ email, full_name, role }`
- **Response**: `{ user }`

#### GET /users
List users in tenant (Protected)
- **Query**: `{ limit, offset, role }`
- **Response**: `{ users, total }`

#### PUT /users/:id
Update user details (Protected)
- **Body**: `{ full_name, role, is_active }`
- **Response**: `{ user }`

#### DELETE /users/:id
Delete user (Protected)
- **Response**: `{ message }`

### Project Endpoints

#### POST /projects
Create new project (Protected)
- **Body**: `{ name, description }`
- **Response**: `{ project }`

#### GET /projects
List tenant projects (Protected)
- **Query**: `{ limit, offset, status }`
- **Response**: `{ projects, total }`

#### PUT /projects/:id
Update project (Protected)
- **Body**: `{ name, description, status }`
- **Response**: `{ project }`

#### DELETE /projects/:id
Delete project (Protected)
- **Response**: `{ message }`

### Task Endpoints

#### POST /tasks
Create new task (Protected)
- **Body**: `{ project_id, title, description, priority, assigned_to }`
- **Response**: `{ task }`

#### GET /tasks
List tasks (Protected)
- **Query**: `{ project_id, status, assigned_to, limit, offset }`
- **Response**: `{ tasks, total }`

#### PUT /tasks/:id
Update task (Protected)
- **Body**: `{ title, description, priority, assigned_to, due_date }`
- **Response**: `{ task }`

#### PATCH /tasks/:id/status
Update task status (Protected)
- **Body**: `{ status }`
- **Response**: `{ task }`

### System Endpoints

#### GET /health
Health check endpoint (Public)
- **Response**: `{ status, timestamp }`

#### GET /stats
Get system statistics (Protected)
- **Response**: `{ user_count, project_count, task_count }`

## Error Codes

| Code | Message |
|------|----------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |
