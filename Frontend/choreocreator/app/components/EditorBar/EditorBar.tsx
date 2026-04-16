'use client';

import React, { useMemo, useState } from 'react';
import { PlusOutlined, DeleteOutlined, UsergroupAddOutlined, SaveOutlined, CloudUploadOutlined, DownloadOutlined, DiffOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Layout, MenuProps, Typography } from 'antd';
import { DancerPosition, Formation } from '../../Models/Types';
import Menu from 'antd/es/menu/menu';
import { useTheme } from '@/app/context/theme-context';

const { Sider } = Layout;
const { Title } = Typography;

type EditorBarProps = {
    dancerCount: number; dancerPositions: DancerPosition[]; selectedDancerId: string | null; onSelectDancer: (id: string) => void; onAddDancer: () => void; onDeleteDancer: () => void;
    formationCount: number; formations: Formation[]; selectedFormationId: string | null; onSelectFormation: (id: string) => void; onAddFormation: () => void; onDeleteFormation: () => void;
    onSaveScenario: () => void; onPublicScenario: () => void; onExportScenario: () => void;
    totalDurationMs: number; onChangeTotalDuration: (ms: number) => void; onUpdateFormationMeta: (id: string, name: string, description: string) => void;
};

type MenuItem = Required<MenuProps>["items"][number];
const items: MenuItem[] = [{ key: '1', icon: <UsergroupAddOutlined style={{ fontSize: 20 }} />, label: 'Танцоры' }, { key: '2', icon: <DiffOutlined style={{ fontSize: 20 }} />, label: 'Слайды' }, { key: '3', icon: <SaveOutlined style={{ fontSize: 20 }} />, label: 'Сохранить' }];

const EditorBar: React.FC<EditorBarProps> = (props) => {
    const { dancerCount, dancerPositions, selectedDancerId, onSelectDancer, onAddDancer, onDeleteDancer, formationCount, formations, selectedFormationId, onSelectFormation, onAddFormation, onDeleteFormation, onSaveScenario, onPublicScenario, onExportScenario, totalDurationMs, onChangeTotalDuration, onUpdateFormationMeta } = props;
    const [selectedMenuKey, setSelectedMenuKey] = useState('1');
    const { mode } = useTheme();
    const selectedFormation = useMemo(() => formations.find(f => f.id === selectedFormationId) ?? null, [formations, selectedFormationId]);

    return <Sider theme={mode === 'dark' ? 'dark' : 'light'} width={250} style={{ position: 'fixed', top: 65, bottom: 0, left: 0, zIndex: 10, borderRight: '1px solid var(--editor-sidebar-border)' }}>
        <Menu theme={mode === 'dark' ? 'dark' : 'light'} mode="inline" selectedKeys={[selectedMenuKey]} onClick={(e) => setSelectedMenuKey(e.key)} style={{ borderBottom: '1px solid var(--editor-sidebar-border)' }} items={items} />

        {selectedMenuKey === '1' && <>
            <div style={{ padding: 10 }}><Title level={5} style={{ color: 'var(--editor-item-text)', display: 'flex', justifyContent: 'space-between' }}>Танцоры: {dancerCount}<Button icon={<PlusOutlined />} onClick={onAddDancer} /></Title></div>
            <div style={{ overflowY: 'auto', paddingBottom: 5 }}>{dancerPositions.map((d, i) => <div key={d.id} onClick={() => onSelectDancer(d.id)} style={{ padding: 8, background: d.id === selectedDancerId ? 'var(--editor-item-selected-bg)' : 'transparent', color: 'var(--editor-item-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, border: d.id === selectedDancerId ? '1px solid var(--editor-item-selected-border)' : '1px solid transparent' }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--scene-dancer-fill, #cc3f7c)', border: d.id === selectedDancerId ? '2px solid var(--scene-dancer-selected-stroke, #ff76b5)' : '1px solid var(--scene-dancer-stroke, #8f2554)', display: 'inline-block' }} />Танцор {i + 1} ({d.position.x}, {d.position.y})</div>)}</div>
            <div style={{ position: 'absolute', bottom: 10, width: '100%', padding: 8 }}><Button danger ghost onClick={onDeleteDancer} block icon={<DeleteOutlined />}>Удалить</Button></div>
        </>}

        {selectedMenuKey === '2' && <>
            <div style={{ padding: 10 }}>
                <Title level={5} style={{ color: 'var(--editor-item-text)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>Слайды: {formationCount}<Button className="editor-add-button" icon={<PlusOutlined />} onClick={onAddFormation} /></Title>
                <div style={{ color: 'var(--editor-item-text)', marginBottom: 6 }}>Общая длительность (сек)</div>
                <InputNumber min={10} max={600} value={Math.round(totalDurationMs / 1000)} onChange={(v) => onChangeTotalDuration((Number(v) || 10) * 1000)} style={{ width: '100%', marginBottom: 10 }} />
            </div>
            <div style={{ overflowY: 'auto', paddingBottom: 5 }}>{formations.map((f, i) => <div key={f.id} onClick={() => onSelectFormation(f.id)} style={{ padding: 8, background: f.id === selectedFormationId ? 'var(--editor-item-selected-bg)' : 'transparent', color: 'var(--editor-item-text)', cursor: 'pointer' }}>{f.name || `Слайд ${i + 1}`}</div>)}</div>
            {selectedFormation && <div style={{ padding: 10 }}>
                <Input value={selectedFormation.name} placeholder="Имя" onChange={(e) => onUpdateFormationMeta(selectedFormation.id, e.target.value, selectedFormation.description)} style={{ marginBottom: 8 }} />
                <Input.TextArea value={selectedFormation.description} placeholder="Описание" rows={3} onChange={(e) => onUpdateFormationMeta(selectedFormation.id, selectedFormation.name, e.target.value)} />
            </div>}
            <div style={{ position: 'absolute', bottom: 10, width: '100%', padding: 8 }}><Button danger ghost onClick={onDeleteFormation} block icon={<DeleteOutlined />}>Удалить</Button></div>
        </>}

        {selectedMenuKey === '3' && <div style={{ padding: 10 }}>
            <Button className="editor-action-button" style={{ marginTop: 5, paddingTop: 25, paddingBottom: 25 }} icon={<SaveOutlined />} block onClick={onSaveScenario}>Сохранить</Button>
            <Button className="editor-action-button" style={{ marginTop: 15, paddingTop: 25, paddingBottom: 25 }} icon={<CloudUploadOutlined />} block onClick={onPublicScenario}>Опубликовать</Button>
            <Button className="editor-action-button" style={{ marginTop: 15, paddingTop: 25, paddingBottom: 25 }} icon={<DownloadOutlined />} block onClick={onExportScenario}>Экспортировать</Button>
        </div>}
    </Sider>;
};

export default EditorBar;
