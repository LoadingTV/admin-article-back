/*
  Warnings:

  - A unique constraint covering the columns `[article_id]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ALTER COLUMN "url" DROP NOT NULL,
ALTER COLUMN "caption" DROP NOT NULL,
ALTER COLUMN "alt_text" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Image_article_id_key" ON "Image"("article_id");
