'use client';

import React from 'react';
import { DancerPosition } from '@/app/Models/Types';

import { HighlightArea } from './Scene/HighlightArea';
import { BorderFrame } from './Scene/BorderFrame';
import { BackstageLabel } from './Scene/BackstageLabel';
import { XLabels } from './Scene/XLabels';
import { DancerMarkers } from './Scene/DancerMarkers';
import { Grid } from './Scene/Grid';
import { defaultSceneTheme, pdfSceneTheme } from './Scene/sceneTheme';
import { width as sceneWidth, height as sceneHeight } from './Scene/gridUtils';

interface FormationSvgProps {
    dancerPositions: DancerPosition[];
    width: number;
    height: number;
    isForPdf: boolean;
}

const FormationSvg: React.FC<FormationSvgProps> = ({ dancerPositions, width, height, isForPdf }) => {
    const sceneTheme = isForPdf ? pdfSceneTheme : defaultSceneTheme;

    return (
        <svg 
            width={width} 
            height={height} 
            style={{ userSelect: 'none' }}
            viewBox="0 0 1360 720"
        >
            <rect width={sceneWidth} height={sceneHeight} fill={sceneTheme.background} pointerEvents="none" />
            <Grid stroke={sceneTheme.grid} />
            <HighlightArea fill={sceneTheme.highlight} />
            <BorderFrame stroke={sceneTheme.border} />
            <BackstageLabel color={sceneTheme.backstage} />
            <XLabels color={sceneTheme.label} />
            {/* Танцоров рендерим без обработчиков и выделения */}
            <DancerMarkers
                dancerPositions={dancerPositions}
                selectedDancerId={null}
                onSelectDancer={undefined}
                onMouseDown={undefined}
                fill={sceneTheme.dancerFill}
                stroke={sceneTheme.dancerStroke}
                selectedStroke={sceneTheme.dancerSelectedStroke}
                textColor={sceneTheme.dancerText}
            />
        </svg>
    );
};

export default FormationSvg;
