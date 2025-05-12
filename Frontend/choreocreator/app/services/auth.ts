const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5281';

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

// Функция входа
export async function login(data: LoginRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

// Функция регистрации
export async function register(data: RegisterRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
  const response = await fetch("http://localhost:5281/api/auth/me", {
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const user = await response.json();

  return {
    username: user.username?.value ?? user.username, // на случай, если value уже не объект
    email: user.email,
    role: user.role,
  };
};

export async function logout(): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
