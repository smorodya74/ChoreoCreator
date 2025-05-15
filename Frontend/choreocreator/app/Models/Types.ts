export type Formation = {
    id: string;
    numberInScenario: number;
    dancers: Dancer[];
}

export type Dancer = {
    id: string;
    numberInFormation: number;
    position: { x: number; y: number };
};