-- Add deleted_at columns for soft delete functionality
ALTER TABLE "EventSignup" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP WITH TIME ZONE;
ALTER TABLE volunteer_applications ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Create indices for performance on soft deletes
CREATE INDEX IF NOT EXISTS idx_event_signup_deleted_at ON "EventSignup"("deletedAt");
CREATE INDEX IF NOT EXISTS idx_suggestions_deleted_at ON suggestions("deletedAt");
CREATE INDEX IF NOT EXISTS idx_volunteer_applications_deleted_at ON volunteer_applications(deleted_at);
