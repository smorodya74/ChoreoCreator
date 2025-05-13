'use client';

import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import EditorSidebar from '@/app/components/EditorBar/EditorBar';
import { useAuth } from '../context/auth-context';
import Scene from '../components/Scene/Scene';
import { Dancer } from '../Models/Types';

const { Header, Content } = Layout;

export default function EditorPage() {
    const { user } = useAuth();
    const [dancers, setDancers] = useState<Dancer[]>([]);
    const [selectedDancerId, setSelectedDancerId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            console.log('[LOGGER] Создание нового сценария для гостя...');
        } else {
            console.log('[LOGGER] Загрузка проекта пользователя...');
        }

        // Первый танцор по умолчанию
        setDancers([
            {
                id: crypto.randomUUID(),
                position: { x: 0, y: 0 },
            },
        ]);
    }, [user]);

    const handleAddDancer = () => {
        if (dancers.length >= 16) return; // Не добавляем больше 16 танцоров

        const GRID_WIDTH = 32;
        const GRID_HEIGHT = 16;
        const minX = -GRID_WIDTH / 2;
        const maxX = GRID_WIDTH / 2;
        const maxY = GRID_HEIGHT / 2;
        const minY = -GRID_HEIGHT / 2;
        
        {/* Поиск свободной координаты */}
        let found = false;
        for (let y = maxY; y >= minY; y--) {
            for (let x = minX; x <= maxX; x++) {
                const taken = dancers.some(d => d.position.x === x && d.position.y === y);
                if (!taken) {
                    setDancers(prev => [
                        ...prev,
                        {
                            id: crypto.randomUUID(),
                            position: { x, y },
                        },
                    ]);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    };

    const handleUpdateDancer = (id: string, newPosition: { x: number; y: number }) => {
        setDancers(prev =>
            prev.map(d => (d.id === id ? { ...d, position: newPosition } : d))
        );
    };

    const handleSelectDancer = (id: string) => {
        setSelectedDancerId(id);
    };

    const handleDeleteDancer = () => {
        if (selectedDancerId && dancers.length > 1) {
            setDancers(prev => prev.filter(d => d.id !== selectedDancerId));
            setSelectedDancerId(null);
        }
    };

    const handleSave = () => {
        console.log('Сохранение проекта...');
        // Логика сохранения проекта
    };

    return (
        <Layout style={{ height: 'calc(100vh - 64px)' }}>
            <EditorSidebar
                onAddDancer={handleAddDancer}
                onDeleteDancer={handleDeleteDancer}
                dancerCount={dancers.length}
                dancers={dancers}
                selectedDancerId={selectedDancerId}
                onSelectDancer={handleSelectDancer}
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
