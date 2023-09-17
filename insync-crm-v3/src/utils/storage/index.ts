const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

export default class Storage {
  private storage: globalThis.Storage;
  private prefixKey?: string;

  constructor(prefixKey = '', storage = localStorage) {
    this.storage = storage;
    this.prefixKey = prefixKey;
  }

  private getKey(key: string) {
    return `${this.prefixKey}${key}`.toUpperCase();
  }

  getAuthorization(key: any) {
    return `Bearer ${this.get(key)}`;
  }

  isAuthenticated(key: any): boolean {
    return !!localStorage.getItem(key);
  }

  set(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
    const stringData = JSON.stringify({
      value,
      expire: expire !== null ? new Date().getTime() + expire * 1000 : null
    });
    this.storage.setItem(this.getKey(key), stringData);
  }

  get(key: string, def: any = null) {
    const item = this.storage.getItem(this.getKey(key));
    if (item) {
      try {
        const data = JSON.parse(item);
        const { value, expire } = data;
        if (expire === null || expire >= Date.now()) {
          return value;
        }
        this.remove(key);
      } catch (e) {
        return def;
      }
    }
    return def;
  }

  remove(key: string) {
    this.storage.removeItem(this.getKey(key));
  }

  setCookie(name: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
    document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`;
  }

  getCookie(name: string): string {
    const cookieArr = document.cookie.split('; ');
    for (let i = 0, length = cookieArr.length; i < length; i++) {
      const kv = cookieArr[i].split('=');
      if (kv[0] === this.getKey(name)) {
        return kv[1];
      }
    }
    return '';
  }

  removeCookie(key: string) {
    this.setCookie(key, 1, -1);
  }

  clearCookie(): void {
    const keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--; ) {
        document.cookie = keys[i] + '=0;expire=' + new Date(0).toUTCString();
      }
    }
  }
}

export const storage = new Storage('');
