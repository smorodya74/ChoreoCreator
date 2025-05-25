import React from 'react';
import { CELL_SIZE, GRID_WIDTH, GRID_HEIGHT, width, height } from './gridUtils';

export const Grid: React.FC = () => (
    <>
        {Array.from({ length: GRID_WIDTH + 1 }, (_, i) => {
            const x = i * CELL_SIZE;
            return (
                <line
                    key={`v-${i}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={height}
                    stroke="#404040"
                    strokeWidth={1}
                />
            );
        })}
        {Array.from({ length: GRID_HEIGHT + 1 }, (_, i) => {
            const y = i * CELL_SIZE;
            return (
                <line
                    key={`h-${i}`}
                    x1={0}
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke="#404040"
                    strokeWidth={1}
                />
            );
        })}
    </>
);
