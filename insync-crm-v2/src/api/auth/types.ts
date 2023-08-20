import type { User } from '@src/types/user';

export interface LoginModel {
  email: string;
  password: string;
}

export type UserTokenResponse = {
  user: User;
  token: string;
};
