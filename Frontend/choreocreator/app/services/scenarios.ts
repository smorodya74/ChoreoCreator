export interface ScenarioRequest {
    title: string;
    description: string;
    dancerCount: number;
    author: string;
}

export const getAllScenarios = async () => {
    const response = await fetch("http://localhost:5281/Scenarios");

    return response.json();
}

export const createScenario = async (scenarioRequest: ScenarioRequest) => {
    await fetch("http://localhost:5281/Scenarios", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(scenarioRequest),
    });
}

export const updateScenario = async(id: string, scenarioRequest: ScenarioRequest) => {
    await fetch(`http://localhost:5281/Scenarios/${id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(scenarioRequest),
    });
}

export const deleteScenario = async(id: string) => {
    await fetch(`http://localhost:5281/Scenarios/${id}`, {
        method: "DELETE",
    });
}