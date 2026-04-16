import { mockUsers } from "@/app/utils/mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const FALLBACK_ERROR_MESSAGES: Record<number, string> = {
    400: "Проверьте корректность введённых данных",
    401: "Требуется авторизация",
    403: "Недостаточно прав",
    404: "Сервис пользователей недоступен",
    500: "Внутренняя ошибка сервера",
    502: "Сервис пользователей временно недоступен",
    503: "Сервис пользователей временно недоступен",
    504: "Сервис пользователей не отвечает",
};

const getApiBaseUrl = () => {
    if (!API_URL) {
        throw new Error("Не задан NEXT_PUBLIC_API_URL");
    }
    return API_URL;
};

const getFallbackErrorMessage = (status: number) => {
    return FALLBACK_ERROR_MESSAGES[status] ?? `Ошибка сервиса (${status})`;
};

const looksLikeHtml = (payload: string): boolean => {
    const normalized = payload.trim().toLowerCase();
    return normalized.startsWith("<!doctype html") || normalized.startsWith("<html");
};

const parseErrorMessage = async (response: Response): Promise<string> => {
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
};

export interface UserDto {
    id: string;
    username: string;
    email: string;
    role: string;
    isBlocked: boolean;
}

export const getAllUsers = async (): Promise<UserDto[]> => {
    if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
        return mockUsers.map((user) => ({
            ...user,
            isBlocked: false,
        }));
    }

    const response = await fetch(`${getApiBaseUrl()}/Users`, {
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
    }

    return response.json();
};

export const changePassword = async (
    currentPassword: string,
    newPassword: string) => {
    if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
        if (!currentPassword || !newPassword) {
            throw new Error("Пожалуйста, заполните все поля");
        }
        return "Пароль успешно изменен";
    }

    const response = await fetch(`${getApiBaseUrl()}/users/change-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            currentPassword,
            newPassword
        })
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
    }

    return await response.text();
};

export const changeBlockStatus = async (id: string, isBlocked: boolean) => {
    if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
        return;
    }

    const res = await fetch(`${getApiBaseUrl()}/users/change-block-status`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id, isBlocked }),
    });

    if (!res.ok) throw new Error(await parseErrorMessage(res));
};

export const deleteUser = async (id: string) => {
    if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
        return;
    }

    const res = await fetch(`${getApiBaseUrl()}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) throw new Error(await parseErrorMessage(res));
};
