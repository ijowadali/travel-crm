import type { BasePageModel } from '@src/constants/page';

export interface Response {
  code?: number | string;
  message?: string;
}

export interface BaseResponse<T = any> extends Response {
  result: T;
}

export interface PageResponse<T = any> extends Response {
  result: T;
  pageCount: number;
  pageSize: number;
  total: number;
}

export enum OrderType {
  descend = 'desc',
  ascend = 'asc',
}

interface PageBaseModel {
  page: number;
  pageSize: number;
  searchText?: string;
  startDate?: string;
  endDate?: string;
}

export interface PageRequestModel extends PageBaseModel {
  sort?: string;
  order?: string;
}

export interface Sorter {
  key: string;
  order: OrderType;
}

export interface PageModel extends BasePageModel {
  sorters?: Sorter[];
}
