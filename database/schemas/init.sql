-- Initialize Email Deliverability Analyzer Database
-- Run all migrations in order

\i /docker-entrypoint-initdb.d/001_create_users_table.sql
\i /docker-entrypoint-initdb.d/002_create_domains_table.sql
\i /docker-entrypoint-initdb.d/003_create_test_results_table.sql

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_domains_updated_at BEFORE UPDATE ON domains
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
