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
        numberInScenario: 1,
        dancers: [{ 
            id: uuidv4(), 
            numberInFormation: 1, 
            position: { x: 0, y: 0 },
        }]
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
                numberInScenario: 1,
                dancers: [
                    {
                        id: initialDancerId,
                        numberInFormation: 1,
                        position: { x: 0, y: 0 },
                    },
                ],
            },
        ]);
        setSelectedFormationId(initialFormationId);
        setSelectedDancerId(initialDancerId);
    }, [user]);


    // ДОБАВИТЬ ТАНЦОРА
    const handleAddDancer = () => {
        if (currentFormation && dancers.length < 16) {
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
                            numberInFormation: dancers.length + 1,
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

                // Удаление выбранного танцора
                const updatedDancers = formation.dancers
                    .filter(d => d.id !== selectedDancerId)
                    .map((d, idx) => ({
                        ...d,
                        numberInFormation: idx + 1, // переиндексация
                    }));

                const updated = [...prev];
                updated[index] = {
                    ...formation,
                    dancers: updatedDancers,
                };

                return updated;
            });

            setSelectedDancerId(null);
        }
    };


    // ДОБАВИТЬ СЛАЙД
    const handleAddFormation = () => {
        if (formations.length >= 16) return;

        const lastFormation = formations[formations.length - 1];

        const newFormation: Formation = {
            id: uuidv4(),
            numberInScenario: lastFormation.numberInScenario + 1,
            dancers: lastFormation.dancers.map((d, index) => ({
                id: uuidv4(),
                numberInFormation: index + 1,
                position: { ...d.position },
            })),
        };

        setFormations(prev => [...prev, newFormation]);
        setSelectedFormationId(newFormation.id);
        setSelectedDancerId(null);
    };


    // УДАЛИТЬ СЛАЙД
    const handleDeleteFormation = () => {
        if (!selectedFormationId || formations.length <= 1) return;

        setFormations(prev => {
            const indexToDelete = prev.findIndex(f => f.id === selectedFormationId);
            if (indexToDelete === -1) return prev;

            const updated = prev.filter((_, i) => i !== indexToDelete);

            // Переиндексация numberInScenario
            const reIndexed = updated.map((f, index) => ({
                ...f,
                numberInScenario: index + 1,
            }));

            const newSelectedIndex = indexToDelete > 0 ? indexToDelete - 1 : 0;

            setSelectedFormationId(reIndexed[newSelectedIndex].id);
            setSelectedDancerId(null);

            return reIndexed;
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

            <Layout style={{background: '#041527'}}>
                <Content 
                    style={{ 
                        marginTop: 50, 
                        marginLeft: 300,
                        marginRight: 50, 
                        padding: 0, 
                        background: '#041527' 
                    }}>
                    <Scene 
                        dancers={dancers} 
                        onMove={handleUpdateDancer}
                        onSelectDancer={handleSelectDancer}
                        selectedDancerId={selectedDancerId} 
                    />
                </Content>
            </Layout>
        </Layout>
    );
}