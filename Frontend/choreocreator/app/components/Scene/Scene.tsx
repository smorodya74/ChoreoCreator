'use client';

import React, { useRef, useEffect, useState } from 'react';
import { DancerPosition } from '@/app/Models/Types';
import {
    CELL_SIZE,
    GRID_WIDTH,
    GRID_HEIGHT,
    minX,
    maxX,
    minY,
    maxY,
    VISIBLE_FRAME,
    width,
    height,
    gridToPx,
    pxToGrid,
} from './gridUtils';

import { Grid } from './Grid';
import { HighlightArea } from './HighlightArea';
import { BorderFrame } from './BorderFrame';
import { BackstageLabel } from './BackstageLabel';
import { XLabels } from './XLabels';
import { DancerMarkers } from './DancerMarkers';

type SceneProps = {
    dancerPositions: DancerPosition[];
    onMove: (id: string, position: { x: number; y: number }) => void;
    selectedDancerId: string | null;
    onSelectDancer: (id: string) => void;
};

const Scene: React.FC<SceneProps> = ({
    dancerPositions,
    onMove,
    selectedDancerId,
    onSelectDancer,
}) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    useEffect(() => {
        function handleMouseUp() {
            setDraggingId(null);
        }
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    function handleMouseDown(e: React.MouseEvent, id: string) {
        e.preventDefault();
        setDraggingId(id);
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (!draggingId || !svgRef.current) return;

        const svgRect = svgRef.current.getBoundingClientRect();
        const mouseX = e.clientX - svgRect.left;
        const mouseY = e.clientY - svgRect.top;

        let { x, y } = pxToGrid(mouseX, mouseY);

        if (x < minX) x = minX;
        if (x > maxX) x = maxX;
        if (y < minY) y = minY;
        if (y > maxY) y = maxY;

        onMove(draggingId, { x, y });
    }

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            onMouseMove={handleMouseMove}
            style={{ userSelect: 'none' }}
        >
            <Grid />
            <HighlightArea />
            <BorderFrame />
            <BackstageLabel />
            <XLabels labelColor='white'/>
            <DancerMarkers
                dancerPositions={dancerPositions}
                selectedDancerId={selectedDancerId}
                onSelectDancer={onSelectDancer}
                onMouseDown={handleMouseDown}
            />
        </svg>
    );
};

export default Scene;
