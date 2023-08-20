import type { BaseResponse } from '@src/types/request';
import Request from '@src/api/axios';
import type { UploadOptions, UploadResponse } from './types';
import { useEnv } from '@src/hooks/useEnv';

const { uploadUrl } = useEnv();

export class UploadAPI {
  private static UPLOAD_API = uploadUrl;

  private static headers = { 'Content-Type': 'multipart/form-data' };

  static uploadFile(data: any, options?: UploadOptions) {
    return Request.post<BaseResponse<UploadResponse>>(this.UPLOAD_API, data, {
      headers: this.headers,
      onUploadProgress: options?.onUploadProgress
        ? options.onUploadProgress
        : () => {},
    });
  }

  static uploadFiles(data: any) {
    return Request.post(`${this.UPLOAD_API}/batch`, data, {
      headers: this.headers,
    });
  }
}
