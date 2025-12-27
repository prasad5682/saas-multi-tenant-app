MIGRATIONS.md  # Database Migration Strategy

## Overview
Database migrations provide version control for the database schema, enabling safe deployments and rollbacks across dev, staging, and production environments.

## Migration Structure
Each migration file is named: `{sequence}_{description}.sql`

### Current Migrations
- `001_init.sql` - Initial schema (tenants, users, subscriptions, audit_logs)

## Running Migrations

### Development
```bash
cd backend
npm run migrate:dev
```

### Staging  
```bash
DB_HOST=staging-db.example.com npm run migrate:staging
```

### Production
```bash
DB_HOST=prod-db.example.com npm run migrate:prod
```

## Creating a New Migration

1. Create migration file:
```bash
touch db/migrations/002_add_new_table.sql
```

2. Write SQL:
```sql
-- Migration: 002_add_new_table
-- Created at: 2025-01-01
-- Description: Add new_table for feature X

BEGIN;

CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_new_table_tenant_id ON new_table(tenant_id);

COMMIT;
```

## Rollback Strategy

### Create Rollback Migration
For each migration, create a corresponding rollback:
```bash
# Create rollback file
touch db/migrations/rollbacks/002_add_new_table.sql
```

### Rollback SQL
```sql
-- Rollback for: 002_add_new_table
BEGIN;

DROP TABLE IF EXISTS new_table;

COMMIT;
```

## Best Practices

1. **Atomic Changes**: Each migration should be self-contained and idempotent
2. **Test First**: Always test migrations on a copy of production data
3. **Backup Before**: Create database backup before running migrations in production  
4. **Zero-Downtime**: Use online migration techniques for large tables
5. **Document Changes**: Include description in migration comments
6. **Version Control**: Commit migrations with application code

## Multi-Tenant Considerations

Migrations automatically apply to all tenants. For tenant-specific data:
```sql
-- Add column to existing table
ALTER TABLE users ADD COLUMN feature_flag BOOLEAN DEFAULT false;

-- Update specific tenant data
Add database migration strategy and rollback proceduresWHERE tenant_id = '...';
```

## Monitoring

Track migration status:
```sql
SELECT * FROM schema_migrations ORDER BY id DESC LIMIT 10;
```

## Emergency Procedures

### Detect Failed Migration
```bash
npm run migrate:status
```

### Rollback Last Migration
```bash
npm run migrate:rollback
```

### Rollback to Specific Migration
```bash
DB_MIGRATION_VERSION=001 npm run migrate:rollback
```
