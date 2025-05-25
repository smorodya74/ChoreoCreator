export const CELL_SIZE = 40;
export const GRID_WIDTH = 34;
export const GRID_HEIGHT = 18;

export const minX = -GRID_WIDTH / 2;
export const maxX = GRID_WIDTH / 2;
export const minY = -GRID_HEIGHT / 2;
export const maxY = GRID_HEIGHT / 2;

export const VISIBLE_FRAME = {
    x1: minX + 1,
    x2: maxX - 1,
    y1: minY + 1,
    y2: maxY - 1,
};

export const width = GRID_WIDTH * CELL_SIZE;
export const height = GRID_HEIGHT * CELL_SIZE;

export function gridToPx(x: number, y: number) {
    const gridOffsetX = width / 2;
    const gridOffsetY = height / 2;
    return {
        x: x * CELL_SIZE + gridOffsetX,
        y: -y * CELL_SIZE + gridOffsetY,
    };
}

export function pxToGrid(px: number, py: number) {
    const gridOffsetX = width / 2;
    const gridOffsetY = height / 2;
    return {
        x: Math.round((px - gridOffsetX) / CELL_SIZE),
        y: -Math.round((py - gridOffsetY) / CELL_SIZE),
    };
}
