# Database Migrations & Automation

This document describes the automated database migration system for the Unconf2 application, including CI/CD integration and best practices.

## 📋 Migration Scripts Overview

### Core Migration Commands

| Script | Purpose | Environment |
|--------|---------|-------------|
| `npm run db:migrate` | Create and apply new migration (dev) | Development |
| `npm run db:migrate:deploy` | Apply pending migrations (production-safe) | Production/Staging |
| `npm run db:migrate:status` | Check migration status | All |
| `npm run db:generate` | Generate Prisma client | All |
| `npm run db:seed` | Run database seeds | Development/Staging |

### Automation Scripts

| Script | Purpose | Features |
|--------|---------|----------|
| `npm run db:ci` | Full CI/CD migration workflow | Environment detection, error handling, verification |
| `npm run db:ci:dry-run` | Test migration without changes | Safe testing in CI |
| `npm run db:prod:migrate` | Production-specific migration | No dev features, extra safety |
| `npm run db:setup` | Complete local setup | Migrate + Generate + Seed |
| `npm run db:verify` | Verify migration integrity | Status check + Type check |

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migration dry-run
        run: npm run db:ci:dry-run
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DIRECT_URL: ${{ secrets.DIRECT_URL }}
          NODE_ENV: production
      
      - name: Deploy migrations
        run: npm run db:prod:migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          DIRECT_URL: ${{ secrets.DIRECT_URL }}
          NODE_ENV: production
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### Vercel Integration

Add to your `package.json` build script:

```json
{
  "scripts": {
    "vercel-build": "npm run db:verify && npm run build"
  }
}
```

### Environment Variables

Required for all environments:

```bash
# Production/Staging
DATABASE_URL="postgresql://postgres.project:password@region.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.project:password@region.pooler.supabase.com:5432/postgres"
NODE_ENV="production"

# Development
DATABASE_URL="postgresql://postgres.project:password@region.pooler.supabase.com:5432/postgres?connection_limit=1&pool_timeout=10"
DIRECT_URL="postgresql://postgres.project:password@region.pooler.supabase.com:5432/postgres"
NODE_ENV="development"
```

## 📝 Migration Workflow

### 1. Development Workflow

```bash
# Create a new migration
npm run db:migrate

# This will:
# 1. Prompt for migration name
# 2. Generate migration files
# 3. Apply to database
# 4. Update Prisma client
```

### 2. Production Deployment

```bash
# Dry run first (recommended)
npm run db:ci:dry-run

# Deploy to production
npm run db:prod:migrate
```

### 3. Local Development Setup

```bash
# Fresh setup
npm run db:setup

# This will:
# 1. Apply all migrations
# 2. Generate Prisma client  
# 3. Run seeds for sample data
```

## 🔧 Migration Script Features

### Automated Migration Script (`scripts/migrate.sh`)

**Features:**
- ✅ Environment detection (dev/staging/production)
- ✅ Comprehensive error handling with colored output
- ✅ Migration status verification
- ✅ Database connection testing
- ✅ Dry-run mode for safe testing
- ✅ Automatic rollback on failure
- ✅ Detailed logging with timestamps

**Environment Handling:**
- **Production**: Uses `prisma migrate deploy` (safe, no dev features)
- **Development/Staging**: Uses `prisma migrate dev` (full features)
- **All Environments**: Validates environment variables first

**Safety Features:**
- Pre-flight environment variable checks
- Migration status verification before and after
- Database connection testing
- Graceful error handling with detailed messages
- Script interruption handling

## 🌱 Database Seeding

### Seed Script (`prisma/seed.ts`)

The seed script creates sample data for development:

```typescript
// Creates sample users:
// - Demo Organizer (organizer@unconf.example)
// - Demo Attendee 1 (attendee1@unconf.example)  
// - Demo Attendee 2 (attendee2@unconf.example)
// - Anonymous User (no email)
```

**Features:**
- ✅ Environment-aware (skips cleanup in production)
- ✅ TypeScript with full type safety
- ✅ Detailed logging and error handling
- ✅ Automatic cleanup in development
- ✅ Safe for repeated runs

### Running Seeds

```bash
# Run seeds manually
npm run db:seed

# Seeds are automatically run by:
npm run db:setup    # Local development setup
npm run db:ci       # CI/CD workflow (dev/staging only)
```

## 🚨 Troubleshooting

### Common Issues

1. **Migration Status Errors**
   ```bash
   # Check current status
   npm run db:migrate:status
   
   # Resolve stuck migrations
   npm run db:migrate:resolve
   ```

2. **Connection Issues**
   ```bash
   # Test connection
   npm run db:verify
   
   # Check environment variables
   echo $DATABASE_URL
   echo $DIRECT_URL
   ```

3. **Migration Conflicts**
   ```bash
   # Reset development database
   npm run db:reset
   
   # Fresh setup
   npm run db:setup
   ```

### CI/CD Debugging

1. **Enable Debug Logging**
   ```bash
   DEBUG=true npm run db:ci
   ```

2. **Test Locally**
   ```bash
   # Simulate CI environment
   NODE_ENV=production npm run db:ci:dry-run
   ```

3. **Manual Migration Steps**
   ```bash
   # Step by step
   npx prisma migrate status
   npx prisma migrate deploy
   npx prisma generate
   ```

## 📊 Best Practices

### Migration Safety

1. **Always use dry-run in CI/CD first**
2. **Test migrations on staging before production**
3. **Keep migrations small and focused**
4. **Never edit existing migration files**
5. **Use descriptive migration names**

### Environment Management

1. **Separate database URLs for each environment**
2. **Use connection pooling in production**
3. **Set appropriate connection limits**
4. **Monitor migration performance**

### CI/CD Integration

1. **Run migrations before building**
2. **Use proper environment variables**
3. **Implement proper error handling**
4. **Log migration results for debugging**
5. **Consider blue-green deployments for zero downtime**

## 🔄 Migration Commands Reference

### Quick Reference

```bash
# Development
npm run db:migrate              # Create new migration
npm run db:setup               # Complete local setup
npm run db:seed                # Seed with sample data

# CI/CD
npm run db:ci                  # Full automation workflow
npm run db:ci:dry-run          # Test without changes
npm run db:prod:migrate        # Production deployment

# Utilities
npm run db:migrate:status      # Check status
npm run db:generate           # Generate client
npm run db:verify             # Verify integrity
npm run db:reset              # Reset database (dev only)
```

### Advanced Usage

```bash
# Custom migration name
npx prisma migrate dev --name "add-user-roles"

# Deploy specific migration
npx prisma migrate deploy --preview-feature

# Resolve specific migration
npx prisma migrate resolve --applied "20231201_add_users"
```

This migration system provides robust, automated database management suitable for production environments while maintaining developer-friendly workflows for local development. 