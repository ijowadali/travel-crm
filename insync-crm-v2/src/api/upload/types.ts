import type { AxiosProgressEvent } from 'axios';

export interface UploadResponse {
  path: string;
}

export type UploadProgressFc = (progressEvent?: AxiosProgressEvent) => void;

export interface UploadOptions {
  onUploadProgress?: UploadProgressFc;
}
