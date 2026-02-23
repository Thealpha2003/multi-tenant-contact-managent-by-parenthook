-- Run this in pgAdmin if you get: "Key (tenant_id)=(1) is not present in table 'tenants'"
-- This adds the tenant rows that the app expects (Company 1 and Company 2)

INSERT INTO tenants (id, name) VALUES (1, 'Company 1'), (2, 'Company 2');
