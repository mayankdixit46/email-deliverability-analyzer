-- Create domains table
CREATE TABLE IF NOT EXISTS domains (
  id SERIAL PRIMARY KEY,
  domain_name VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(domain_name, user_id)
);

CREATE INDEX idx_domains_user_id ON domains(user_id);
CREATE INDEX idx_domains_status ON domains(status);
CREATE INDEX idx_domains_domain_name ON domains(domain_name);
