-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'solver');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'student';
