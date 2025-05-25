import React from 'react';
import { gridToPx } from './gridUtils';
import { DancerPosition } from '@/app/Models/Types';

type DancerMarkersProps = {
    dancerPositions: DancerPosition[];
    selectedDancerId?: string | null;
    onSelectDancer?: (id: string) => void;
    onMouseDown?: (e: React.MouseEvent, id: string) => void;
};

export const DancerMarkers: React.FC<DancerMarkersProps> = ({
    dancerPositions,
    selectedDancerId,
    onSelectDancer,
    onMouseDown,
}) => (
    <>
        {dancerPositions.map((dancerPosition) => {
            const { x, y } = gridToPx(dancerPosition.position.x, dancerPosition.position.y);
            return (
                <g key={dancerPosition.id}>
                    <circle
                        cx={x}
                        cy={y}
                        r={16}
                        fill="#c83a77"
                        stroke={dancerPosition.id === selectedDancerId ? '#FFFFFF' : '#c83a77'}
                        strokeWidth={dancerPosition.id === selectedDancerId ? 2 : 1}
                        onMouseDown={onMouseDown ? (e) => onMouseDown(e, dancerPosition.id) : undefined}
                        onClick={onSelectDancer ? () => onSelectDancer(dancerPosition.id) : undefined}
                        style={{
                            cursor: onMouseDown ? 'grab' : 'default',
                            transition: 'stroke 0.2s, stroke-width 0.2s',
                        }}
                    />
                    <text
                        x={x}
                        y={y}
                        fill="white"
                        fontSize="14"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        pointerEvents="none"
                    >
                        {dancerPosition.numberInFormation}
                    </text>
                </g>
            );
        })}
    </>
);
