-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "keyPoints" DROP NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;
