import React from 'react';
import { CELL_SIZE, minX, GRID_WIDTH, height } from './gridUtils';

interface XLabelsProps {
    color: string;
}

export const XLabels: React.FC<XLabelsProps> = ({ color }) => (
    <>
        {Array.from({ length: GRID_WIDTH + 1 }, (_, i) => {
            const xMark = minX + i;
            const px = i * CELL_SIZE+7;
            return (
                <text
                    key={`x-label-${i}`}
                    x={px}
                    y={height - 5}
                    fill={color}
                    fontSize={10}
                    textAnchor="middle"
                >
                    {xMark}
                </text>
            );
        })}
    </>
);
