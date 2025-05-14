'use client';

import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import EditorSidebar from '@/app/components/EditorBar/EditorBar';
import { useAuth } from '../context/auth-context';
import Scene from '../components/Scene/Scene';
import { Dancer, Formation } from '../Models/Types';
import { v4 as uuidv4 } from 'uuid';

const { Header, Content } = Layout;

export default function EditorPage() {
    const { user } = useAuth();

    const [formations, setFormations] = useState<Formation[]>([{
        id: uuidv4(),
        number: 1,
        dancers: [{ id: uuidv4(), position: { x: 0, y: 0 },}]
    }]);

    const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
    const [selectedDancerId, setSelectedDancerId] = useState<string | null>(null);

    const currentFormation = formations.find(f => f.id === selectedFormationId);
    const dancers = currentFormation?.dancers ?? [];

    useEffect(() => {
        if (!user) {
            console.log('[LOGGER] Создание нового сценария для гостя...');
        } else {
            console.log('[LOGGER] Загрузка проекта пользователя...');
        }

        // Первый танцор по умолчанию
        const initialFormationId = crypto.randomUUID();
        const initialDancerId = crypto.randomUUID();
        setFormations([
            {
                id: initialFormationId,
                number: 0,
                dancers: [
                    {
                        id: initialDancerId,
                        position: { x: 0, y: 0 },
                    },
                ],
            },
        ]);
        setSelectedFormationId(initialFormationId);
        setSelectedDancerId(null);
    }, [user]);


    // ДОБАВИТЬ ТАНЦОРА
    const handleAddDancer = () => {
        if (currentFormation && dancers.length <= 16) {
            const GRID_WIDTH = 32;
            const GRID_HEIGHT = 16;
            const minX = -GRID_WIDTH / 2;
            const maxX = GRID_WIDTH / 2;
            const maxY = GRID_HEIGHT / 2;
            const minY = -GRID_HEIGHT / 2;

            for (let y = maxY; y >= minY; y--) {
                for (let x = minX; x <= maxX; x++) {
                    const taken = dancers.some(d => d.position.x === x && d.position.y === y);
                    if (!taken) {
                        const newDancer = {
                            id: crypto.randomUUID(),
                            position: { x, y },
                        };

                        setFormations(prev => {
                            const index = prev.findIndex(f => f.id === selectedFormationId);
                            if (index === -1) return prev;

                            const updated = [...prev];
                            const updatedFormation = { ...updated[index] };
                            updatedFormation.dancers = [...updatedFormation.dancers, newDancer];
                            updated[index] = updatedFormation;

                            return updated;
                        });

                        return;
                    }
                }

            }
        }
    };

    // ОБНОВИТЬ ТАНЦОРА
    const handleUpdateDancer = (id: string, newPosition: { x: number; y: number }) => {
        if (selectedFormationId) {
            setFormations(prev => {
                const index = prev.findIndex(f => f.id === selectedFormationId);
                if (index === -1) return prev;

                const formation = prev[index];
                const updatedDancers = formation.dancers.map(d =>
                    d.id === id ? { ...d, position: newPosition } : d
                );

                const updated = [...prev];
                updated[index] = {
                    ...formation,
                    dancers: updatedDancers,
                };

                return updated;
            })
        };
    };


    // ВЫБРАТЬ ТАНЦОРА
    const handleSelectDancer = (id: string) => {
        setSelectedDancerId(id);
    };


    // УДАЛИТЬ ТАНЦОРА
    const handleDeleteDancer = () => {
        if (selectedDancerId && dancers.length > 1) {
            setFormations(prev => {
                const index = prev.findIndex(f => f.id === selectedFormationId);
                if (index === -1) return prev;

                const formation = prev[index];
                const updatedDancers = formation.dancers.filter(d => d.id !== selectedDancerId);

                const updated = [...prev];
                updated[index] = {
                    ...formation,
                    dancers: updatedDancers,
                };

                return updated;
            });

            setSelectedDancerId(null);
        };
    }


    // ДОБАВИТЬ СЛАЙД
    const handleAddFormation = () => {
        if (formations.length >= 16) return;

        const lastFormation = formations[formations.length - 1];

        const newFormation: Formation = {
            id: uuidv4(),
            number: lastFormation.number + 1,
            dancers: lastFormation.dancers.map(d => ({
                    id: uuidv4(),
                    position: { ...d.position },
                })),
        };

        setFormations(prev => [...prev, newFormation]);
        setSelectedFormationId(newFormation.id); // переход на новый слайд
        setSelectedDancerId(null);
    };


    // УДАЛИТЬ СЛАЙД
    const handleDeleteFormation = () => {
        if (!selectedFormationId || formations.length <= 1) return;

        setFormations(prev => {
            const indexToDelete = prev.findIndex(f => f.id === selectedFormationId);
            if (indexToDelete === -1) return prev;

            const updated = prev.filter((_, i) => i !== indexToDelete);
            const newSelectedIndex = indexToDelete > 0 ? indexToDelete - 1 : 0;

            setSelectedFormationId(updated[newSelectedIndex].id);
            setSelectedDancerId(null);

            return updated;
        });
    };


    // ВЫБРАТЬ СЛАЙД
    const handleSelectFormation = (id: string) => {
        const formationExists = formations.some(f => f.id === id);
        if (!formationExists) return;

        setSelectedFormationId(id);
        setSelectedDancerId(null);
    };


    // СОХРАНИТЬ ТИПА
    const handleSave = () => {
        console.log('Сохранение проекта...');
        // Логика сохранения проекта
    };


    return (
        <Layout style={{ height: 'calc(100vh - 64px)' }}>
            <EditorSidebar
                dancerCount={dancers.length}
                dancers={dancers}
                selectedDancerId={selectedDancerId}
                onSelectDancer={handleSelectDancer}
                onAddDancer={handleAddDancer}
                onDeleteDancer={handleDeleteDancer}
                formationCount={formations.length}
                formations={formations}
                selectedFormationId={selectedFormationId}
                onSelectFormation={handleSelectFormation}
                onAddFormation={handleAddFormation}
                onDeleteFormation={handleDeleteFormation}
                onSave={handleSave}
            />

            <Layout>
                <Header style={{ padding: 0, background: '#041527' }} />
                <Content style={{ marginLeft: 250, padding: 0, background: '#041527' }}>
                    <Scene dancers={dancers} onMove={handleUpdateDancer} />
                </Content>
            </Layout>
        </Layout>
    );
}