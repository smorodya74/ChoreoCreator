import { mockScenarios } from "@/scr/mockData";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ScenarioRequest {
    title: string;
    description: string;
    dancerCount: number;
    author: string;
}

export const getAllScenarios = async () => {
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
        return mockScenarios.list;
    }
    
    const response = await fetch(`${API_URL}/scenarios`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const errorText = await response.text(); // для отладки
        console.error("Failed to fetch scenarios", response.status, errorText);
        throw new Error(`Failed to fetch scenarios: ${response.status}`);
    }

    return response.json();
}

export const createScenario = async (scenarioRequest: ScenarioRequest) => {
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
        return mockScenarios.create(scenarioRequest);
    }
    
    const response = await fetch(`${API_URL}/scenarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(scenarioRequest),
        credentials: "include",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при создании сценария: ${response.status} ${errorText}`);
    }

    return await response.json();  // Вернёт ID созданного сценария или другие данные
};

export const updateScenario = async (id: string, scenarioRequest: ScenarioRequest) => {
    const response = await fetch(`${API_URL}/scenarios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(scenarioRequest),
        credentials: "include",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при обновлении сценария: ${response.status} ${errorText}`);
    }

    return await response.json();  // Вернёт обновлённые данные сценария или ID
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

    return await response.json();
};