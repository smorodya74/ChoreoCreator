export type Formation = {
    id: string;
    numberInScenario: number;
    dancerPositions: DancerPosition[];
}

export type DancerPosition = {
    id: string;
    numberInFormation: number;
    position: Position;
};

export interface Position {
    x: number;
    y: number;
}

export interface ScenarioRequest {
    title: string;
    description: string;
    dancerCount: number;
    isPublished: boolean;
    formations: Formation[];
}

export interface ScenarioResponse {
    id: string;
    title: string;
    description: string;
    dancerCount: number;
    isPublished: boolean;
    username: string;
    formations: Formation[];
}