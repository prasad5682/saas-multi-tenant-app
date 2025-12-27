# EXACT PROJECT REQUIREMENTS

## 19 APIs TOTAL

### Auth (4 APIs)
- POST /api/auth/register-tenant
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Tenants (5 APIs)
- GET /api/tenants (superadmin only, with pagination)
- POST /api/tenants (NOT used - registration via auth)
- GET /api/tenants/:id
- PUT /api/tenants/:id
- DELETE /api/tenants/:id

### Users (5 APIs)
- POST /api/tenants/:tenantId/users (add user)
- GET /api/tenants/:tenantId/users (list users)
- GET /api/users/:id (get user)
- PUT /api/users/:id (update user)
- DELETE /api/users/:id (delete user)

### Projects (3 APIs)
- POST /api/projects (create project)
- GET /api/projects (list projects with pagination)
- DELETE /api/projects/:id (delete project)

### Tasks (2 APIs)
- POST /api/projects/:projectId/tasks (create task)
- GET /api/projects/:projectId/tasks (list tasks with filters)

## Database Tables (6)
1. tenants (subscription_plan: free/pro/enterprise)
2. users (tenantid, role: superadmin/tenantadmin/user)
3. projects (tenantid, createdBy)
4. tasks (projectid, tenantid, status, priority, duedate)
5. auditlogs (for compliance)
6. sessions (OPTIONAL - JWT only is fine)

## NO SUBSCRIPTION APIs
DO NOT CREATE:
- POST /api/subscriptions
- GET /api/subscriptions
- PUT /api/subscriptions/:id
- DELETE /api/subscriptions/:id

Instead: Use subscription_plan column in tenants table
and enforce limits in create user/project logic

## Frontend (6 Pages)
1. /register - Tenant registration
2. /login - User login
3. /dashboard - Main dashboard
4. /projects - List projects
5. /projects/:id - Project details with tasks
6. /users - User management (admin only)

## Docker Files
- docker-compose.yml (services: database, backend, frontend)
- backend/Dockerfile
- frontend/Dockerfile
- Auto seed data on startup
- Auto migrations on startup

## Key Points
- Multi-tenancy with complete isolation
- JWT 24-hour expiry
- Role-based access control
- Subscription limits enforced per plan
- All APIs return {success, message?, data?}
- Proper HTTP status codes
- Audit logging for all actions
