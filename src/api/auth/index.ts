import Request from '@src/api/axios';

export const loginApi = (data: any) => {
  return Request.post('/auth/login', { ...data });
};

export const getUserInfoApi = () => {
  return Request.get('/users/authenticated');
};
