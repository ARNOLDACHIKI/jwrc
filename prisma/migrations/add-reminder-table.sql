-- Create Reminder table
CREATE TABLE IF NOT EXISTS "Reminder" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "template" TEXT,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
