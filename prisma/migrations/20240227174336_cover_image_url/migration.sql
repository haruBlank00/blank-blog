/*
  Warnings:

  - Added the required column `coverImageUrl` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Blog" ADD COLUMN     "coverImageUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
