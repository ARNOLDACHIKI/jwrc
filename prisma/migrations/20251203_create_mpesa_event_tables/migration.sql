-- Migration: create donations, event_signups, mpesa_donations tables

CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC,
  currency TEXT,
  kes_amount INTEGER,
  method TEXT,
  donor_name TEXT,
  donor_email TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  ref TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS event_signups_ref_idx ON event_signups(ref);

CREATE TABLE IF NOT EXISTS mpesa_donations (
  id SERIAL PRIMARY KEY,
  amount NUMERIC,
  phone TEXT,
  account_reference TEXT,
  transaction_desc TEXT,
  merchant_request_id TEXT,
  checkout_request_id TEXT,
  status TEXT DEFAULT 'pending',
  mpesa_transaction_id TEXT,
  response_code TEXT,
  response_description TEXT,
  provider_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure function gen_random_uuid() exists (pgcrypto) for UUID default if not using uuid-ossp
-- You can remove or adapt the UUID default depending on your Postgres setup.
