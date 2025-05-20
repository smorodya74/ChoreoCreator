export type Formation = {
    id: string;
    numberInScenario: number;
    dancers: Dancer[];
}

export type Dancer = {
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