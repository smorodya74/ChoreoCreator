'use client'

import React from 'react';
import './Scene.css';

const GRID_WIDTH = 32;
const GRID_HEIGHT = 16;
const CELL_SIZE = 40; // px

const Scene: React.FC = () => {
    const xRange = Array.from({ length: GRID_WIDTH + 1 }, (_, i) => i - GRID_WIDTH / 2);
    const yRange = Array.from({ length: GRID_HEIGHT + 1 }, (_, i) => (GRID_HEIGHT / 2) - i);

    return (
        <div className="scene-wrapper">
            <div
                className="grid"
                style={{
                    gridTemplateColumns: `repeat(${GRID_WIDTH + 1}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${GRID_HEIGHT + 1}, ${CELL_SIZE}px)`,
                }}
            >
                {yRange.map((y) =>
                    xRange.map((x) => (
                        <div key={`${x},${y}`} className="grid-point">
                            {/* Центр или маркеры можно выделить отдельно */}
                        </div>
                    ))
                )}
            </div>

            <div className="x-axis-labels">
                {xRange.map((x) => (
                    <div
                        key={x}
                        style={{ width: CELL_SIZE, textAlign: 'center' }}
                    >
                        {x}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Scene;
