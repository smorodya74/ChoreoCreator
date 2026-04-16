export type Formation = {
    id: string;
    numberInScenario: number;
    startTimeMs: number;
    durationMs: number;
    animationDurationMs: number;
    name: string;
    description: string;
    isAutoName: boolean;
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
    totalDurationMs: number;
    formations: Formation[];
}

export interface ScenarioResponse {
    id: string;
    title: string;
    description: string;
    dancerCount: number;
    isPublished: boolean;
    totalDurationMs: number;
    username: string;
    formations: Formation[];
}
