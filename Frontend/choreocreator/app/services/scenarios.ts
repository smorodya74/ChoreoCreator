export interface ScenarioRequest {
    title: string;
    description: string;
    dancerCount: number;
    author: string;
}

export const getAllScenarios = async () => {
    const response = await fetch("http://localhost:5281/api/scenarios", {
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
    const response = await fetch("http://localhost:5281/api/scenarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(scenarioRequest),
        credentials: "include",  // Чтобы передавать cookie
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при создании сценария: ${response.status} ${errorText}`);
    }

    return await response.json();  // Вернёт ID созданного сценария или другие данные
};

export const updateScenario = async (id: string, scenarioRequest: ScenarioRequest) => {
    const response = await fetch(`http://localhost:5281/api/scenarios/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(scenarioRequest),
        credentials: "include",  // Чтобы передавать cookie
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при обновлении сценария: ${response.status} ${errorText}`);
    }

    return await response.json();  // Вернёт обновлённые данные сценария или ID
};

export const deleteScenario = async (id: string) => {
    const response = await fetch(`http://localhost:5281/api/scenarios/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ошибка при удалении сценария: ${response.status} ${errorText}`);
    }

    return await response.json();
};