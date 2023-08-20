export class AuthUtils {
  private static LOCAL_STORAGE_TOKEN = 'access_token';

  static LOCAL_STORAGE_REMEMBERED_ACCOUNT = 'user_password';

  static getToken() {
    return localStorage.getItem(this.LOCAL_STORAGE_TOKEN);
  }

  static getAuthorization() {
    return `Bearer ${this.getToken()}`;
  }

  static setToken(token: string) {
    localStorage.setItem(this.LOCAL_STORAGE_TOKEN, token);
  }

  static clearToken() {
    localStorage.removeItem(this.LOCAL_STORAGE_TOKEN);
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(this.LOCAL_STORAGE_TOKEN);
  }

  static getRememberedAccount() {
    return localStorage.getItem(this.LOCAL_STORAGE_REMEMBERED_ACCOUNT);
  }

  static setRememberedAccount(data: string) {
    localStorage.setItem(this.LOCAL_STORAGE_REMEMBERED_ACCOUNT, data);
  }

  static clearRememberedAccount() {
    localStorage.removeItem(this.LOCAL_STORAGE_REMEMBERED_ACCOUNT);
  }
}
