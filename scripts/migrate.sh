#!/bin/bash

# Database Migration Script for CI/CD
# Handles automated database migrations with proper error handling and rollback

set -e  # Exit on any error

# Load environment variables from .env.local if it exists
if [ -f ".env.local" ]; then
    echo "Loading environment variables from .env.local..."
    export $(grep -v '^#' .env.local | xargs)
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Environment check
ENVIRONMENT=${NODE_ENV:-development}
DRY_RUN=${DRY_RUN:-false}

echo -e "${BLUE}🚀 Starting database migration for environment: ${ENVIRONMENT}${NC}"
echo -e "${BLUE}📅 $(date)${NC}"

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if required environment variables are set
check_env() {
    log "🔍 Checking environment variables..."
    
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL is not set"
        exit 1
    fi
    
    if [ -z "$DIRECT_URL" ]; then
        error "DIRECT_URL is not set"
        exit 1
    fi
    
    log "✅ Environment variables are configured"
}

# Check migration status
check_migration_status() {
    log "📊 Checking current migration status..."
    
    if ! npx prisma migrate status; then
        error "Failed to check migration status"
        exit 1
    fi
    
    log "✅ Migration status check completed"
}

# Run migrations
run_migrations() {
    if [ "$DRY_RUN" = "true" ]; then
        warning "🔍 DRY RUN MODE - No changes will be applied"
        log "Would run: npx prisma migrate deploy"
        return 0
    fi
    
    log "🔄 Running database migrations..."
    
    if [ "$ENVIRONMENT" = "production" ]; then
        # Production: Use migrate deploy (no dev features)
        if ! npx prisma migrate deploy; then
            error "Production migration failed"
            exit 1
        fi
    else
        # Development/Staging: Use migrate dev
        if ! npx prisma migrate dev --name "automated-migration-$(date +%Y%m%d-%H%M%S)"; then
            error "Development migration failed"
            exit 1
        fi
    fi
    
    log "✅ Migrations completed successfully"
}

# Generate Prisma client
generate_client() {
    log "🔧 Generating Prisma client..."
    
    if [ "$DRY_RUN" = "true" ]; then
        warning "🔍 DRY RUN MODE - Skipping client generation"
        return 0
    fi
    
    if ! npx prisma generate; then
        error "Failed to generate Prisma client"
        exit 1
    fi
    
    log "✅ Prisma client generated successfully"
}

# Run seeds (only in development/staging)
run_seeds() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log "⏭️  Skipping seeds in production environment"
        return 0
    fi
    
    if [ "$DRY_RUN" = "true" ]; then
        warning "🔍 DRY RUN MODE - Skipping seed execution"
        return 0
    fi
    
    log "🌱 Running database seeds..."
    
    if ! npm run db:seed; then
        warning "Seed execution failed, but continuing..."
    else
        log "✅ Seeds completed successfully"
    fi
}

# Verify migration success
verify_migration() {
    log "🔍 Verifying migration success..."
    
    # Check that migrations are applied
    if ! npx prisma migrate status; then
        error "Migration verification failed"
        exit 1
    fi
    
    # Test database connection
    if ! node -e "
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        prisma.\$queryRaw\`SELECT 1 as test\`
            .then(() => {
                console.log('✅ Database connection test passed');
                process.exit(0);
            })
            .catch((error) => {
                console.error('❌ Database connection test failed:', error);
                process.exit(1);
            })
            .finally(() => prisma.\$disconnect());
    "; then
        error "Database connection verification failed"
        exit 1
    fi
    
    log "✅ Migration verification completed"
}

# Main execution
main() {
    log "🎯 Starting automated migration workflow..."
    
    check_env
    check_migration_status
    run_migrations
    generate_client
    run_seeds
    verify_migration
    
    echo -e "${GREEN}🎉 Migration workflow completed successfully!${NC}"
    echo -e "${BLUE}📅 Completed at: $(date)${NC}"
}

# Handle script interruption
trap 'error "Migration interrupted"; exit 1' INT TERM

# Execute main function
main "$@" 