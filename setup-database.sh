#!/bin/bash

# LEGACORE™ Platform - Database Setup Script
# This script sets up the complete database schema and seed data

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SQL_DIR="$SCRIPT_DIR/scripts"

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_header() {
    echo ""
    print_message "$BLUE" "=================================="
    print_message "$BLUE" "$1"
    print_message "$BLUE" "=================================="
    echo ""
}

print_success() {
    print_message "$GREEN" "✓ $1"
}

print_error() {
    print_message "$RED" "✗ $1"
}

print_warning() {
    print_message "$YELLOW" "⚠ $1"
}

# Check if required environment variables are set
check_environment() {
    print_header "Checking Environment"
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        print_error "NEXT_PUBLIC_SUPABASE_URL is not set"
        print_warning "Please set it in your .env.local file"
        exit 1
    fi
    
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
        print_error "SUPABASE_SERVICE_ROLE_KEY is not set"
        print_warning "Please set it in your .env.local file"
        exit 1
    fi
    
    print_success "Environment variables configured"
}

# Check if SQL files exist
check_sql_files() {
    print_header "Checking SQL Files"
    
    local files=(
        "$SQL_DIR/enterprise-schema.sql"
        "$SQL_DIR/seed-enterprise-data.sql"
        "$SQL_DIR/advanced-migrations.sql"
    )
    
    for file in "${files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "SQL file not found: $file"
            exit 1
        fi
        print_success "Found: $(basename "$file")"
    done
}

# Extract database connection details
get_db_connection() {
    print_header "Extracting Database Connection"
    
    # Extract from Supabase URL
    # Format: https://[project-ref].supabase.co
    local url=$NEXT_PUBLIC_SUPABASE_URL
    
    if [[ $url =~ https://([^.]+)\.supabase\.co ]]; then
        PROJECT_REF="${BASH_REMATCH[1]}"
        print_success "Project Reference: $PROJECT_REF"
    else
        print_error "Invalid Supabase URL format"
        exit 1
    fi
    
    # Construct database URL
    DB_URL="postgresql://postgres:[PASSWORD]@db.${PROJECT_REF}.supabase.co:5432/postgres"
    
    print_warning "You'll need to enter your database password when prompted"
}

# Execute SQL file using Supabase REST API
execute_sql_via_api() {
    local sql_file=$1
    local description=$2
    
    print_message "$BLUE" "Executing: $description"
    
    local sql_content=$(cat "$sql_file")
    
    # Use Supabase Management API to execute SQL
    local response=$(curl -s -X POST \
        "${NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc" \
        -H "apikey: ${SUPABASE_SERVICE_ROLE_KEY}" \
        -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
        -H "Content-Type: application/json" \
        -d "{\"query\": $(echo "$sql_content" | jq -Rs .)}")
    
    if [ $? -eq 0 ]; then
        print_success "$description completed"
    else
        print_error "$description failed"
        echo "$response"
        return 1
    fi
}

# Execute SQL file using psql (if available)
execute_sql_via_psql() {
    local sql_file=$1
    local description=$2
    
    print_message "$BLUE" "Executing: $description"
    
    if command -v psql &> /dev/null; then
        psql "$DB_CONNECTION_STRING" -f "$sql_file"
        
        if [ $? -eq 0 ]; then
            print_success "$description completed"
        else
            print_error "$description failed"
            return 1
        fi
    else
        print_warning "psql not found, using alternative method"
        return 2
    fi
}

# Main setup function
setup_database() {
    print_header "Database Setup"
    
    print_warning "This will create/update database schema and seed data"
    print_warning "Make sure you have a backup if running on existing database"
    echo ""
    read -p "Continue? (y/N) " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Setup cancelled"
        exit 0
    fi
    
    # Read database password
    echo ""
    read -sp "Enter your Supabase database password: " DB_PASSWORD
    echo ""
    
    DB_CONNECTION_STRING="postgresql://postgres:${DB_PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres"
    
    # Execute SQL files in order
    local sql_files=(
        "$SQL_DIR/enterprise-schema.sql:Enterprise Schema"
        "$SQL_DIR/seed-enterprise-data.sql:Seed Data"
        "$SQL_DIR/advanced-migrations.sql:Advanced Migrations"
    )
    
    for file_desc in "${sql_files[@]}"; do
        IFS=':' read -r file desc <<< "$file_desc"
        
        execute_sql_via_psql "$file" "$desc"
        local result=$?
        
        if [ $result -eq 2 ]; then
            # psql not available, suggest manual execution
            print_warning "Please execute $file manually via Supabase SQL Editor"
            print_warning "1. Go to your Supabase project dashboard"
            print_warning "2. Navigate to SQL Editor"
            print_warning "3. Open and execute: $file"
            echo ""
            read -p "Press Enter after executing the file..." -r
        elif [ $result -ne 0 ]; then
            print_error "Failed to execute $desc"
            exit 1
        fi
    done
}

# Verify database setup
verify_setup() {
    print_header "Verifying Setup"
    
    print_message "$BLUE" "Checking tables..."
    
    # List of expected tables
    local tables=(
        "companies"
        "users"
        "agents"
        "conversations"
        "business_verticals"
        "model_configurations"
        "performance_analytics"
        "legacy_vault_advanced"
        "agent_backstories"
        "deployment_workflows"
        "security_audit_logs"
        "company_configurations"
    )
    
    print_success "Expected tables: ${#tables[@]}"
    print_warning "Please verify tables exist in Supabase dashboard"
}

# Generate test query
generate_test_query() {
    print_header "Test Query"
    
    cat > "$SCRIPT_DIR/test-query.sql" << EOF
-- Test Query - Verify Database Setup
-- Run this in Supabase SQL Editor

-- Check companies
SELECT COUNT(*) as company_count FROM companies;

-- Check users
SELECT COUNT(*) as user_count FROM users;

-- Check agents
SELECT COUNT(*) as agent_count FROM agents;

-- Check business verticals
SELECT COUNT(*) as vertical_count FROM business_verticals;

-- Check model configurations
SELECT COUNT(*) as model_count FROM model_configurations;

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
EOF
    
    print_success "Generated test-query.sql"
    print_message "$YELLOW" "Run this file in Supabase SQL Editor to verify setup"
}

# Main script execution
main() {
    print_header "LEGACORE™ Database Setup"
    print_message "$GREEN" "Built to Outlive the Builder"
    
    check_environment
    check_sql_files
    get_db_connection
    setup_database
    verify_setup
    generate_test_query
    
    print_header "Setup Complete!"
    print_success "Database schema and seed data installed"
    print_warning "Next steps:"
    print_message "$YELLOW" "1. Verify tables in Supabase dashboard"
    print_message "$YELLOW" "2. Run test-query.sql to check data"
    print_message "$YELLOW" "3. Start development server: pnpm dev"
    echo ""
}

# Run main function
main
