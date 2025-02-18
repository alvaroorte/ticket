export class LoginRequest  {
    email: string | null = null;
    password: string | null = null;
}

export interface LoginResponse  {
    message: string;
    token: string;
    username: string;
}
