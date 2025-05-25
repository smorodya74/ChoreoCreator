import React from 'react';
import { CELL_SIZE, minX, GRID_WIDTH, height } from './gridUtils';

interface XLabelsProps {
    labelColor: string;
}

export const XLabels: React.FC<XLabelsProps> = ({ labelColor }) => (
    <>
        {Array.from({ length: GRID_WIDTH + 1 }, (_, i) => {
            const xMark = minX + i;
            const px = i * CELL_SIZE+7;
            return (
                <text
                    key={`x-label-${i}`}
                    x={px}
                    y={height - 5}
                    fill={labelColor}
                    fontSize={10}
                    textAnchor="middle"
                >
                    {xMark}
                </text>
            );
        })}
    </>
);