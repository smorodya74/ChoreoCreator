import { mockScenarios } from "@/scr/mockData";
import { ScenarioRequest, ScenarioResponse } from "../Models/Types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllScenarios = async (): Promise<ScenarioResponse[]> => {
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
        return mockScenarios.list;
    }

    const response = await fetch(`${API_URL}/scenarios`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch scenarios", response.status, errorText);
        throw new Error(`Failed to fetch scenarios: ${response.status}`);
    }

    return response.json();
};

export const getScenarioById = async (id: string): Promise<ScenarioResponse> => {
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
        const scenario = mockScenarios.list.find(s => s.id === id);
        if (!scenario) throw new Error("Scenario not found in mocks");
        return scenario;
    }

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
    if (process.env.NEXT_PUBLIC_MOCK_API === 'true') {
        return mockScenarios.create(scenarioRequest);
    }

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
        credentials: "include",
    });

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