import { jwtDecode } from "jwt-decode";

export class JwtUtils {
  private static TOKEN_KEY = import.meta.env.VITE_JWT_SECRET;

  static setToken(token: string): void {
    if (!this.TOKEN_KEY) throw new Error("JWT_SECRET is not defined");
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    if (!this.TOKEN_KEY) throw new Error("JWT_SECRET is not defined");
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    if (!this.TOKEN_KEY) throw new Error("JWT_SECRET is not defined");
    localStorage.removeItem(this.TOKEN_KEY);
  }

  static decodeToken<T>(token: string): T {
    return jwtDecode<T>(token);
  }

  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = this.decodeToken<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }
}
