  import { mockAuth } from "@/scr/mockData";

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface RegisterRequest {
    email: string;
    username: string;
    password: string;
  }

  export interface User {
    username: string;
    email: string;
    role: string;
  }

  export async function login(data: LoginRequest): Promise<void> {
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
      return mockAuth.login(data);
    }
    
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }
  }

  export async function register(data: RegisterRequest): Promise<void> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    await login({ email: data.email, password: data.password });
  }

  export const getMe = async (): Promise<User | null> => {
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
      return mockAuth.user;
    }
    
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();

    return {
      username: user.username?.value ?? user.username,
      email: user.email?.value ?? user.email,
      role: user.role,
    };
  };

  export async function logout(): Promise<void> {
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
      return mockAuth.logout();
    }
    
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  }
