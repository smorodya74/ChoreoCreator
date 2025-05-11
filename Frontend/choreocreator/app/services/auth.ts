// app/services/auth.ts
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
  const res = await fetch("/api/auth/login", {
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
  const res = await fetch("/api/auth/register", {
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

export async function getMe(): Promise<User | null> {
  const res = await fetch("/api/auth/me", {
    method: "GET",
    credentials: "include",
  });

  if (res.status === 401) return null;

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
