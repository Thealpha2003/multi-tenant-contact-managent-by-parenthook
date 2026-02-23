-- Create tenants table (required if contacts references it)
CREATE TABLE IF NOT EXISTS tenants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contacts_tenant_id ON contacts (tenant_id);

-- Seed tenants (Company 1 and 2) - must run before inserting contacts!
INSERT INTO tenants (id, name) VALUES (1, 'Company 1'), (2, 'Company 2')
ON CONFLICT (id) DO NOTHING;

-- Seed sample contacts
INSERT INTO contacts (tenant_id, name, email) VALUES
  (1, 'Alice Johnson', 'alice@company1.com'),
  (1, 'Bob Smith', 'bob@company1.com'),
  (2, 'Carol Williams', 'carol@company2.com'),
  (2, 'Dave Brown', 'dave@company2.com');
