-- Create test_results table
CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
  test_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_results_domain_id ON test_results(domain_id);
CREATE INDEX idx_test_results_test_type ON test_results(test_type);
CREATE INDEX idx_test_results_status ON test_results(status);
CREATE INDEX idx_test_results_created_at ON test_results(created_at DESC);
