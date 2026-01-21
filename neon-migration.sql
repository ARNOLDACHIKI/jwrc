-- Run this SQL in your Neon database console to create the missing tables

-- Create WeeklyProgram table
CREATE TABLE IF NOT EXISTS "WeeklyProgram" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WeeklyProgram_pkey" PRIMARY KEY ("id")
);

-- Create WeeklyWord table
CREATE TABLE IF NOT EXISTS "WeeklyWord" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "scripture" TEXT,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WeeklyWord_pkey" PRIMARY KEY ("id")
);

-- Optional: Add a sample weekly word
INSERT INTO "WeeklyWord" (id, title, theme, scripture, content, "isActive", "weekStart", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'FAITH',
    'Trusting God in Every Season',
    'Hebrews 11:1',
    'Now faith is confidence in what we hope for and assurance about what we do not see. This week, let us walk by faith and not by sight. Trust that God is working all things together for your good, even when you cannot see the path ahead. Let your faith be stronger than your fears.',
    true,
    CURRENT_DATE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
