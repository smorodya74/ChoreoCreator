import React from 'react';
import { width } from './gridUtils';

type BackstageLabelProps = {
    color: string;
};

export const BackstageLabel: React.FC<BackstageLabelProps> = ({ color }) => (
    <text
        x={width / 2}
        y={67}
        fill={color}
        fontSize={20}
        fontWeight="bold"
        textAnchor="middle"
        style={{ letterSpacing: 12 }}
    >
        BACKSTAGE
    </text>
);
