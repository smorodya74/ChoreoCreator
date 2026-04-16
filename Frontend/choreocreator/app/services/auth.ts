import { mockAuth } from "@/app/utils/mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const FALLBACK_ERROR_MESSAGES: Record<number, string> = {
  400: "Проверьте корректность введённых данных",
  401: "Неверный логин или пароль",
  403: "Доступ запрещён",
  404: "Сервис авторизации недоступен",
  500: "Внутренняя ошибка сервера",
  502: "Сервис авторизации временно недоступен",
  503: "Сервис авторизации временно недоступен",
  504: "Сервис авторизации не отвечает",
};

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
  createdAt: string;
}

function looksLikeHtml(payload: string): boolean {
  const normalized = payload.trim().toLowerCase();
  return normalized.startsWith("<!doctype html") || normalized.startsWith("<html");
}

function getFallbackErrorMessage(status: number): string {
  return FALLBACK_ERROR_MESSAGES[status] ?? `Ошибка авторизации (${status})`;
}

async function parseErrorMessage(response: Response): Promise<string> {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json")) {
    const body = await response.json().catch(() => null) as Record<string, unknown> | null;
    const backendMessage = body?.message ?? body?.error ?? body?.title ?? body?.detail;
    if (typeof backendMessage === "string" && backendMessage.trim().length > 0) {
      return backendMessage;
    }

    return getFallbackErrorMessage(response.status);
  }

  const text = await response.text();
  if (!text || looksLikeHtml(text)) {
    return getFallbackErrorMessage(response.status);
  }

  return text;
}

export async function login(data: LoginRequest): Promise<void> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    return mockAuth.login(data);
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const errorMessage = await parseErrorMessage(res);
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Ошибка соединения с сервером");
  }
}

export async function register(data: RegisterRequest): Promise<void> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    return mockAuth.register(data);
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!res.ok) {
      const errorMessage = await parseErrorMessage(res);
      throw new Error(errorMessage);
    }

    await login({ email: data.email, password: data.password });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Ошибка соединения с сервером");
  }
}

export const getMe = async (): Promise<User | null> => {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
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
    createdAt: user.createdAt ?? "",
  };
};

export async function logout(): Promise<void> {
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    return mockAuth.logout();
  }

  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}
