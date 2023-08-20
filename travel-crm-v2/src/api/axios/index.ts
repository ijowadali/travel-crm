import { createDiscreteApi } from 'naive-ui';
import axios from 'axios';
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { router } from '@src/router';
import type { PageModel } from '@src/types/request';

import { axiosConfig } from './config';
import { errorMessageMap, ResponseStatusCode } from './statusCode';
import { useThemeStore } from '@src/store/modules/theme';
import { AuthUtils } from '@src/utils/auth';
import { useEnv } from '@src/hooks/useEnv';

const { apiPrefix } = useEnv();
const themeStore = useThemeStore();

const { message } = createDiscreteApi(['message'], {
  configProviderProps: {
    theme: themeStore.theme,
  },
});

class Request {
  instance: AxiosInstance;

  public constructor(config: AxiosRequestConfig) {
    axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

    this.instance = axios.create(config);

    this.instance.interceptors.request.use(
      (req: InternalAxiosRequestConfig) => {
        const { url } = req;
        if (AuthUtils.isAuthenticated() && url?.startsWith(apiPrefix)) {
          req.headers.Authorization = AuthUtils.getAuthorization();
        }
        return req;
      },
      (err: AxiosError) => Promise.reject(err)
    );

    this.instance.interceptors.response.use(
      (res: AxiosResponse) => res.data,
      (err: AxiosError) => {
        const { response } = err;
        const { data, status } = response || {};
        if (response) {
          Request.handleCode(status as number);
        }
        if (!window.navigator.onLine) {
          router.replace('/404');
          message.error('Network Error');
        }
        return Promise.reject(data);
      }
    );
  }

  static handleCode(code: number): void {
    const errorMessage = errorMessageMap.get(code) || 'Unknown Error!';
    switch (code) {
      case ResponseStatusCode.UNAUTHORIZED:
        AuthUtils.clearToken();
        message.error('Unauthorized');
        if (router.currentRoute.value.path !== '/login') {
          if (router.currentRoute.value.path !== '/') {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.value.fullPath,
              },
            });
          } else {
            router.replace('/login');
          }
        }
        break;
      case ResponseStatusCode.FORBIDDEN:
        message.error(errorMessage);
        break;
      case ResponseStatusCode.INTERNAL_SERVER_ERROR:
      case ResponseStatusCode.BAD_GATEWAY:
      case ResponseStatusCode.GATEWAY_TIMEOUT:
        message.error('Internal Server Error');
        if (router.currentRoute.value.path !== '/login') {
          router.replace('/error-pages/500');
        }
        break;
      case ResponseStatusCode.BAD_REQUEST:
      case ResponseStatusCode.NOT_FOUND:
      case ResponseStatusCode.METHOD_NOT_ALLOWED:
      case ResponseStatusCode.CONFLICT:
      case ResponseStatusCode.TOO_MANY_REQUESTS:
      default:
    }
  }

  request(config: AxiosRequestConfig) {
    return this.instance.request(config);
  }

  get<T>(
    url: string,
    params?: Record<string, unknown> | PageModel,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.get(url, { params, ...config });
  }

  post<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  put<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  delete<T>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.delete(url, { params, ...config });
  }

  patch<T>(url: string, data?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }
}

export default new Request(axiosConfig);
