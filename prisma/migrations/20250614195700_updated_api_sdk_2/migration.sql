/*
  Warnings:

  - A unique constraint covering the columns `[apiId,sdkLanguage]` on the table `SdkVersion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SdkVersion_apiId_sdkLanguage_key" ON "SdkVersion"("apiId", "sdkLanguage");
