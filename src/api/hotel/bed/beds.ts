import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  result: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: Get beds list
 */
export function getBedsApi(params: any) {
  return http.request({
    url: '/beds',
    method: 'get',
    params,
  });
}
