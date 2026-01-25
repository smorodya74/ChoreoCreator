import React from 'react';
import { CELL_SIZE, VISIBLE_FRAME, gridToPx } from './gridUtils';

type BorderFrameProps = {
    stroke: string;
};

export const BorderFrame: React.FC<BorderFrameProps> = ({ stroke }) => {
    const pos = gridToPx(VISIBLE_FRAME.x1, VISIBLE_FRAME.y2);
    const widthPx = (VISIBLE_FRAME.x2 - VISIBLE_FRAME.x1) * CELL_SIZE;
    const heightPx = (VISIBLE_FRAME.y2 - VISIBLE_FRAME.y1) * CELL_SIZE;

    return (
        <rect
            x={pos.x}
            y={pos.y}
            width={widthPx}
            height={heightPx}
            fill="none"
            stroke={stroke}
            strokeWidth={2}
        />
    );
};
