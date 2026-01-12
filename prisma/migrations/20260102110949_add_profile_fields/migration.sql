-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "isVolunteer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT;
