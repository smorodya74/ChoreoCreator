import { ScenarioRequest, ScenarioResponse } from "../Models/Types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllScenarios = async (): Promise<ScenarioResponse[]> => {
    const response = await fetch(`${API_URL}/scenarios`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("[ERROR] Сценарии не найдены", response.status, errorText);
        throw new Error(`Сценарии не найдены: ${response.status}`);
    }

    return response.json();
};

export const getScenarioById = async (id: string): Promise<ScenarioResponse> => {
    const response = await fetch(`${API_URL}/scenarios/${id}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch scenario ${id}: ${response.status} ${errorText}`);
    }

    return response.json();
};

export const createScenario = async (scenarioRequest: ScenarioRequest) => {
    const response = await fetch(`${API_URL}/scenarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenarioRequest),
        credentials: "include",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при создании сценария: ${response.status} ${errorText}`);
    }

    return response.json();
};

export const updateScenario = async (id: string, scenarioRequest: ScenarioRequest) => {
    const response = await fetch(`${API_URL}/scenarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scenarioRequest),
        credentials: "include"
    });
    console.log('[LOGGER] PUT-запрос:', scenarioRequest);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при обновлении сценария: ${response.status} ${errorText}`);
    }

    return response.json();
};

export const deleteScenario = async (id: string) => {
    const response = await fetch(`${API_URL}/scenarios/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при удалении сценария: ${response.status} ${errorText}`);
    }

    // Если 204 — тело пустое
    if (response.status === 204) return;

    return response.json();
};

export const getMyScenario = async (): Promise<ScenarioResponse> => {
    const response = await fetch(`${API_URL}/scenarios/mine`, {
        credentials: 'include'
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Не удалось получить сценарий для текущего пользователя: ${response.status} ${errorText}`);
    }

    return response.json();
}