# Database Schema Documentation

## Overview
PostgreSQL database with 5 core tables implementing multi-tenant architecture with complete data isolation.

## Database Configuration
- **DBMS**: PostgreSQL 13+
- **Host**: localhost (localhost in Docker)
- **Port**: 5432
- **Database**: saas_multi_tenant_db
- **User**: postgres
- **Password**: postgres (default)

## Tables

### 1. Tenants Table
Stores information about each tenant/organization.

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  subscription_plan VARCHAR(50) DEFAULT 'basic',
  max_users INTEGER DEFAULT 5,
  max_projects INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Users Table
Stores user accounts with tenant association.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
```

### 3. Projects Table
Stores projects managed by tenants.

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_projects_status ON projects(status);
```

### 4. Tasks Table
Stores tasks associated with projects.

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_tenant ON tasks(tenant_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
```

### 5. Audit Logs Table
Tracks all operations for compliance and security.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
```

## Multi-Tenant Isolation Strategy

1. **Tenant ID Filtering**: Every query filters by tenant_id from JWT token
2. **Foreign Key Constraints**: tenant_id referenced by all related tables
3. **Row-Level Security**: Only authorized users access tenant data
4. **Application-Level Validation**: Backend validates tenant_id matches token

## Data Types

- **UUID**: Primary keys and foreign keys for security
- **VARCHAR(255)**: Names and identifiers
- **TEXT**: Descriptions and longer content
- **TIMESTAMP**: Created/updated timestamps
- **BOOLEAN**: Status flags
- **INTEGER**: Numeric configurations

## Indexing Strategy

Indexes created on:
- tenant_id: Fast multi-tenant filtering
- Foreign key columns: Referential integrity checks
- Status columns: Filtering and sorting
- Email: Unique constraint and lookups

## Migration Management

Database schema initialized on container startup via migration scripts.

## Backup & Recovery

PostgreSQL backups recommended via pg_dump:
```bash
pg_dump -U postgres saas_multi_tenant_db > backup.sql
```

Restore with:
```bash
psql -U postgres saas_multi_tenant_db < backup.sql
```
