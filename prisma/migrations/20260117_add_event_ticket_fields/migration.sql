-- AlterTable event_signups
ALTER TABLE event_signups 
  ADD COLUMN IF NOT EXISTS ticket_sent BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS checked_in BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMP(3);
