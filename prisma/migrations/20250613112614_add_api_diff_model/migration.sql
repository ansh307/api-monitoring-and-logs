-- CreateTable
CREATE TABLE "ApiDiff" (
    "id" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "diffJson" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiDiff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApiDiff" ADD CONSTRAINT "ApiDiff_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiDiff" ADD CONSTRAINT "ApiDiff_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "ApiVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
