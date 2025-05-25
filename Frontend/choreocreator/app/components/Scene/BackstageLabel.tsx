import React from 'react';
import { width } from './gridUtils';

export const BackstageLabel: React.FC = () => (
    <text
        x={width / 2}
        y={67}
        fill="rgba(200, 58, 119, 0.9)"
        fontSize={20}
        fontWeight="bold"
        textAnchor="middle"
        style={{ letterSpacing: 12 }}
    >
        BACKSTAGE
    </text>
);
