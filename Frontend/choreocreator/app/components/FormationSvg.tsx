'use client';

import React from 'react';
import { DancerPosition } from '@/app/Models/Types';

import { HighlightArea } from './Scene/HighlightArea';
import { BorderFrame } from './Scene/BorderFrame';
import { BackstageLabel } from './Scene/BackstageLabel';
import { XLabels } from './Scene/XLabels';
import { DancerMarkers } from './Scene/DancerMarkers';
import { Grid } from './Scene/Grid';

interface FormationSvgProps {
    dancerPositions: DancerPosition[];
    width: number;
    height: number;
    isForPdf: boolean;
}

const FormationSvg: React.FC<FormationSvgProps> = ({ dancerPositions, width, height, isForPdf }) => {
    const labelColor = isForPdf ? '#000000' : '#FFFFFF'; // тёмный или белый

    return (
        <svg 
            width={width} 
            height={height} 
            style={{ userSelect: 'none' }}
            viewBox="0 0 1360 720"
        >
            <Grid />
            <HighlightArea />
            <BorderFrame />
            <BackstageLabel />
            <XLabels labelColor={labelColor} />
            {/* Танцоров рендерим без обработчиков и выделения */}
            <DancerMarkers
                dancerPositions={dancerPositions}
                selectedDancerId={null}
                onSelectDancer={undefined}
                onMouseDown={undefined}
            />
        </svg>
    );
};

export default FormationSvg;