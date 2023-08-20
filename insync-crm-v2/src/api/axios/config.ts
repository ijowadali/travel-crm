import { useEnv } from '@src/hooks/useEnv';

const { apiUrl } = useEnv();

export const axiosConfig = {
  baseURL: apiUrl,
  timeout: 30000,
  withCredentials: true,
};
