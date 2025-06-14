export interface Api {
  id: string;
  name: string;
  openApiUrl: string;
  userId: string;
  createdAt: string;
}

export interface ApiVersion {
  id: string;
  apiId: string;
  rawJson: string;
  diffSummary: string;
  createdAt: string;
}

export interface ApiDiff {
  id: string;
  apiId: string;
  versionId: string;
  diffJson: string;
  createdAt: string;
}
