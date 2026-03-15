'use client';

import React, { useRef, useEffect, useState } from 'react';
import { DancerPosition } from '@/app/Models/Types';
import {
    minX,
    maxX,
    minY,
    maxY,
    width,
    height,
    pxToGrid,
} from './gridUtils';

import { Grid } from './Grid';
import { HighlightArea } from './HighlightArea';
import { BorderFrame } from './BorderFrame';
import { BackstageLabel } from './BackstageLabel';
import { XLabels } from './XLabels';
import { DancerMarkers } from './DancerMarkers';
import { defaultSceneTheme } from './sceneTheme';

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
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            height="auto"
            onMouseMove={handleMouseMove}
            style={{ userSelect: 'none', width: 'min(100%, 1360px)', height: 'auto', display: 'block' }}
        >
            <rect width={width} height={height} fill={defaultSceneTheme.background} pointerEvents="none" />
            <Grid stroke={defaultSceneTheme.grid} />
            <HighlightArea fill={defaultSceneTheme.highlight} />
            <BorderFrame stroke={defaultSceneTheme.border} />
            <BackstageLabel color={defaultSceneTheme.backstage} />
            <XLabels color={defaultSceneTheme.label} />
            <DancerMarkers
                dancerPositions={dancerPositions}
                selectedDancerId={selectedDancerId}
                onSelectDancer={onSelectDancer}
                onMouseDown={handleMouseDown}
                fill={defaultSceneTheme.dancerFill}
                stroke={defaultSceneTheme.dancerStroke}
                selectedStroke={defaultSceneTheme.dancerSelectedStroke}
                textColor={defaultSceneTheme.dancerText}
            />
        </svg>
    );
};

export default Scene;
