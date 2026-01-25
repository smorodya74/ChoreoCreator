export type SceneTheme = {
    background: string;
    grid: string;
    label: string;
    border: string;
    highlight: string;
    backstage: string;
    dancerFill: string;
    dancerStroke: string;
    dancerSelectedStroke: string;
    dancerText: string;
};

export const defaultSceneTheme: SceneTheme = {
    background: 'var(--scene-bg)',
    grid: 'var(--scene-grid-color)',
    label: 'var(--scene-label-color)',
    border: 'var(--scene-border-color)',
    highlight: 'var(--scene-highlight)',
    backstage: 'var(--scene-backstage-color)',
    dancerFill: 'var(--scene-dancer-fill)',
    dancerStroke: 'var(--scene-dancer-stroke)',
    dancerSelectedStroke: 'var(--scene-dancer-selected-stroke)',
    dancerText: 'var(--scene-dancer-text)',
};

export const pdfSceneTheme: SceneTheme = {
    background: '#ffffff',
    grid: '#cbd5e1',
    label: '#0f172a',
    border: '#c83a77',
    highlight: 'rgba(253, 230, 138, 0.4)',
    backstage: 'rgba(200, 58, 119, 0.9)',
    dancerFill: '#c83a77',
    dancerStroke: '#8f1d4f',
    dancerSelectedStroke: '#0f172a',
    dancerText: '#ffffff',
};
