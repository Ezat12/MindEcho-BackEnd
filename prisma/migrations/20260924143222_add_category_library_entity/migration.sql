-- CreateTable
CREATE TABLE "library" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "content" TEXT,
    "url" TEXT,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "library_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoryLibrary" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categoryLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "libraryMood" (
    "id" TEXT NOT NULL,
    "moodId" TEXT NOT NULL,
    "libraryId" TEXT NOT NULL,

    CONSTRAINT "libraryMood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoryLibrary_slug_key" ON "categoryLibrary"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "libraryMood_moodId_libraryId_key" ON "libraryMood"("moodId", "libraryId");

-- AddForeignKey
ALTER TABLE "library" ADD CONSTRAINT "library_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categoryLibrary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libraryMood" ADD CONSTRAINT "libraryMood_moodId_fkey" FOREIGN KEY ("moodId") REFERENCES "moods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libraryMood" ADD CONSTRAINT "libraryMood_libraryId_fkey" FOREIGN KEY ("libraryId") REFERENCES "library"("id") ON DELETE CASCADE ON UPDATE CASCADE;
