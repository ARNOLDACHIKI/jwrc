-- Create tables matching the Prisma schema and insert production-like data

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS "User" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  role text NOT NULL DEFAULT 'member',
  password text,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);

-- Sermons
CREATE TABLE IF NOT EXISTS "Sermon" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  summary text,
  content text,
  speaker text,
  date timestamptz NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE IF NOT EXISTS "Event" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text,
  "startsAt" timestamptz NOT NULL,
  "endsAt" timestamptz,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

-- Announcements
CREATE TABLE IF NOT EXISTS "Announcement" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text,
  "postedAt" timestamptz NOT NULL DEFAULT now()
);

-- Donations
CREATE TABLE IF NOT EXISTS "Donation" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "donorName" text,
  amount numeric NOT NULL,
  method text,
  "createdAt" timestamptz NOT NULL DEFAULT now()
);

-- Insert production-like records (replace values with your real production data as needed)

-- Organization admin user (do not use this password in real production; replace with secure hash)
INSERT INTO "User" (email, name, role, password)
VALUES
  ('admin@jwrc.org', 'JWRC Admin', 'admin', 'CHANGEME_HASHED_PASSWORD')
ON CONFLICT (email) DO NOTHING;

-- Seed a few sermons
INSERT INTO "Sermon" (title, slug, summary, content, speaker, date)
VALUES
  ('Hope In Action', 'hope-in-action', 'A sermon on living faith', 'Full sermon content goes here...', 'Pastor John Doe', now() - INTERVAL '30 days'),
  ('Foundations of Faith', 'foundations-of-faith', 'Core beliefs and practices', 'Full sermon content goes here...', 'Pastor Jane Smith', now() - INTERVAL '90 days')
ON CONFLICT (slug) DO NOTHING;

-- Seed upcoming events
INSERT INTO "Event" (title, description, location, "startsAt", "endsAt")
VALUES
  ('Sunday Service', 'Weekly worship gathering', 'Main Sanctuary', now() + INTERVAL '7 days', now() + INTERVAL '7 days' + INTERVAL '2 hours'),
  ('Community Outreach', 'Local neighborhood support', 'Community Center', now() + INTERVAL '14 days', now() + INTERVAL '14 days' + INTERVAL '4 hours')
ON CONFLICT (id) DO NOTHING;

-- Seed announcements
INSERT INTO "Announcement" (title, content, author)
VALUES
  ('Holiday Schedule', 'Our holiday service times and office closures are published.', 'Office'),
  ('Volunteer Drive', 'We need volunteers for the outreach event next month.', 'Volunteer Coordinator')
ON CONFLICT (id) DO NOTHING;

-- Seed donations (aggregated example records)
INSERT INTO "Donation" ("donorName", amount, method)
VALUES
  ('Grace Foundation', 5000.00, 'bank_transfer'),
  ('Faithful Donor', 150.00, 'card')
ON CONFLICT (id) DO NOTHING;
