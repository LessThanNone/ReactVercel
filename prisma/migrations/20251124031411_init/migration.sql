-- CreateTable
CREATE TABLE "Kopi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nama" TEXT NOT NULL,
    "notes" TEXT,
    "aroma" TEXT,
    "acidity" TEXT,
    "seduh" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Kopi_nama_key" ON "Kopi"("nama");
