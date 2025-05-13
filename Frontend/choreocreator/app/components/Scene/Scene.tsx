'use client';

import React, { useRef, useEffect, useState } from 'react';
import './Scene.css';
import { Dancer } from '@/app/Models/Types';

type SceneProps = {
    dancers: Dancer[];
    onMove: (id: string, position: { x: number; y: number }) => void;
};

const GRID_WIDTH = 32;
const GRID_HEIGHT = 16;
const CELL_SIZE = 40;

const Scene: React.FC<SceneProps> = ({ dancers, onMove }) => {
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
                border: '2px solid #c83a77',
                margin: 'auto',
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

            {/* Подписи оси X */}
            {Array.from({ length: GRID_WIDTH + 1 }, (_, i) => {
                const x = minX + i;
                const px = i * CELL_SIZE;
                return (
                    <text
                        key={`x-label-${i}`}
                        x={px}
                        y={height + 16}  // Поднимем подпись немного выше, чтобы она не перекрывала сетку
                        fill="#ffffff"
                        fontSize={12}
                        textAnchor="middle"
                    >
                        {x}
                    </text>
                );
            })}

            {/* Танцоры */}
            {dancers.map((dancer) => {
                const { x, y } = gridToPx(dancer.position.x, dancer.position.y);
                return (
                    <circle
                        key={dancer.id}
                        cx={x}
                        cy={y}
                        r={12}
                        fill="#c83a77"
                        stroke="#ffffff"
                        strokeWidth={2}
                        onMouseDown={(e) => handleMouseDown(e, dancer.id)}
                        style={{ cursor: 'grab' }}
                    />
                );
            })}
        </svg>
    );
};

export default Scene;
