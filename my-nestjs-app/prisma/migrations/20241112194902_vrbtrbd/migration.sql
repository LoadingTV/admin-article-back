-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_author_id_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "author_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
