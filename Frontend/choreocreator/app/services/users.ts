const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserDto {
    id: string;
    username: string;
    email: string;
    role: string;
    isBlocked: boolean;
}

export const getAllUsers = async (): Promise<UserDto[]> => {
    const response = await fetch(`${API_URL}/users`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при загрузке пользователей ${response.status}`);
    }

    return response.json();
};

export const changePassword = async (
    currentPassword: string,
    newPassword: string) => {

    const response = await fetch(`${API_URL}/users/change-password`, {
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
        const errorText = await response.text();
        throw new Error(errorText || "Не удалось сменить пароль");
    }

    return await response.text();
};

export const changeBlockStatus = async (id: string, isBlocked: boolean) => {
    const res = await fetch(`${API_URL}/users/change-block-status`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: id, isBlocked }),
    });

    if (!res.ok) throw new Error('Ошибка при изменении статуса блокировки');
};

export const deleteUser = async (id: string) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!res.ok) throw new Error('Ошибка при удалении пользователя');
};