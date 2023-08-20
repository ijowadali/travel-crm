import type { BaseResponse, PageRequestModel, PageResponse } from '@src/types/request';
import type { User } from '@src/types/user';
import { useEnv } from '@src/hooks/useEnv';

import Request from '@src/api/axios';
import type { ChangePasswordModel, CreateModel } from './types';

const { apiPrefix } = useEnv();

export class UserAPI {
  private static PREFIX = `${apiPrefix}/users`;

  static getUsers(params: PageRequestModel) {
    return Request.get<PageResponse<User[]>>(this.PREFIX, {
      ...params,
    });
  }

  static getUser(id: number) {
    return Request.get<BaseResponse<User>>(`${this.PREFIX}/${id}`);
  }

  static getUserInfo() {
    return Request.get<BaseResponse<User>>(`${this.PREFIX}/authenticated`);
  }

  static createUser(data: CreateModel) {
    return Request.post<BaseResponse<User>>(this.PREFIX, { ...data });
  }

  static updateUser(id: number, data: User) {
    return Request.patch<BaseResponse<User>>(`${this.PREFIX}/${id}`, {
      ...data,
    });
  }

  static enableUser(id: number) {
    return Request.post<BaseResponse<User>>(`${this.PREFIX}/${id}/activate`);
  }

  static disableUser(id: number) {
    return Request.post<BaseResponse<User>>(`${this.PREFIX}/${id}/deactivate`);
  }

  static resetPassword(id: number, password: string) {
    return Request.post<BaseResponse<User>>(`${this.PREFIX}/${id}/reset-password`, { password });
  }

  static changePassword(id: number, data: ChangePasswordModel) {
    return Request.post<BaseResponse<User>>(`${this.PREFIX}/${id}/change-password`, { ...data });
  }
}
