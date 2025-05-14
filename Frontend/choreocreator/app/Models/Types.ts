export type Dancer = {
    id: string;
    position: { x: number; y: number };
};

export type Formation = {
    id: string;
    number: number;
    dancers: Dancer[];
}
