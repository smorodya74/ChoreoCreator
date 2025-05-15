'use client';

import React, { useRef, useEffect, useState } from 'react';
import './Scene.css';
import { Dancer } from '@/app/Models/Types';

type SceneProps = {
    dancers: Dancer[];
    onMove: (id: string, position: { x: number; y: number }) => void;
    selectedDancerId: string | null;
    onSelectDancer: (id: string) => void;
};

const GRID_WIDTH = 34;
const GRID_HEIGHT = 18;
const CELL_SIZE = 40;

const Scene: React.FC<SceneProps> = ({
    dancers,
    onMove,
    selectedDancerId,
    onSelectDancer
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    const minX = -GRID_WIDTH / 2;
    const maxX = GRID_WIDTH / 2;
    const minY = -GRID_HEIGHT / 2;
    const maxY = GRID_HEIGHT / 2;

    const width = GRID_WIDTH * CELL_SIZE;
    const height = GRID_HEIGHT * CELL_SIZE;

    const gridOffsetX = width / 2;
    const gridOffsetY = height / 2;

    const VISIBLE_FRAME = {
        x1: (-GRID_WIDTH / 2) + 1,
        x2: (GRID_WIDTH / 2) - 1,
        y1: (-GRID_HEIGHT / 2) + 1,
        y2: (GRID_HEIGHT / 2) - 1,
    };

    const gridToPx = (x: number, y: number) => ({
        x: x * CELL_SIZE + gridOffsetX,
        y: -y * CELL_SIZE + gridOffsetY,
    });

    const pxToGrid = (px: number, py: number) => {
        const x = Math.round((px - gridOffsetX) / CELL_SIZE);
        const y = -Math.round((py - gridOffsetY) / CELL_SIZE);
        return { x, y };
    };

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        setDraggingId(id);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!draggingId || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        const { x, y } = pxToGrid(mouseX, mouseY);

        // Гарантия, что координаты в пределах сцены
        if (x < minX || x > maxX || y < minY || y > maxY) return;

        onMove(draggingId, { x, y });
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingId]);

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            style={{
                display: 'block',
                backgroundColor: '#041527',
                zIndex: 900
            }}
        >
            {/* Сетка */}
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

            {/* Рамка видимой части */}
            <rect
                x={gridToPx(VISIBLE_FRAME.x1, VISIBLE_FRAME.y2).x}
                y={gridToPx(VISIBLE_FRAME.x1, VISIBLE_FRAME.y2).y}
                width={(VISIBLE_FRAME.x2 - VISIBLE_FRAME.x1) * CELL_SIZE}
                height={(VISIBLE_FRAME.y2 - VISIBLE_FRAME.y1) * CELL_SIZE}
                fill="none"
                stroke="#c83a77"
                strokeWidth={2}
            />

            {/* Подпись BACKSTAGE сверху по центру */}
            <text
                x={width / 2}
                y={67} // отступ сверху
                fill="rgba(200, 58, 119, 0.9)"
                fontSize={20}
                fontWeight="bold"
                textAnchor="middle"
                style={{ letterSpacing: 12 }}
            >
                BACKSTAGE
            </text>
            
            {/* Подписи осей X */}
            {Array.from({ length: GRID_WIDTH + 1 }, (_, i) => {
                const xMark = minX + i;
                const px = i * CELL_SIZE;
                return (
                    <text
                        key={`x-label-${i}`}
                        x={px}
                        y={height - 10}
                        fill="#ffffff"
                        fontSize={10}
                        textAnchor="middle"
                    >
                        {xMark}
                    </text>
                );
            })}

            {/* Танцоры */}
            {dancers.map((dancer) => {
                const { x, y } = gridToPx(dancer.position.x, dancer.position.y);
                return (
                    <g key={dancer.id}>
                        <circle
                            cx={x}
                            cy={y}
                            r={16}
                            fill="#c83a77"
                            stroke={dancer.id === selectedDancerId ? '#FFFFFF' : "#c83a77"}
                            strokeWidth={dancer.id === selectedDancerId ? 2 : 1}
                            onMouseDown={(e) => handleMouseDown(e, dancer.id)}
                            onClick={() => onSelectDancer(dancer.id)}
                            style={{
                                cursor: 'grab',
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
                            {dancer.numberInFormation}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default Scene;