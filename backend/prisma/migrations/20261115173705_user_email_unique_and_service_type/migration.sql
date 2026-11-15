/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `services` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('student', 'family', 'individual');

-- AlterTable
ALTER TABLE "services" DROP COLUMN "type",
ADD COLUMN     "type" "ServiceType" NOT NULL;

-- DropEnum
DROP TYPE "Type";

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
