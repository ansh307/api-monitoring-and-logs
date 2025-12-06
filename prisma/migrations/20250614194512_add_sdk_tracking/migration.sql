-- CreateTable
CREATE TABLE "SdkVersion" (
    "id" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "sdkLanguage" TEXT NOT NULL,
    "currentUsed" TEXT,
    "latest" TEXT NOT NULL,
    "releaseNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SdkVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SdkVersion" ADD CONSTRAINT "SdkVersion_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "Api"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
