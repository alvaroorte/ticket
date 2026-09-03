export class LoginRequest  {
    email: string | null = null;
    password: string | null = null;
    captchaToken: string | null = null;
}

export interface LoginResponse  {
    message: string;
    refreshToken: string;
    token: string;
    username: string;
}
