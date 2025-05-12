'use client';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import EditorSidebar from '@/app/components/EditorSidebar';
import { useAuth } from '../context/auth-context';
import Scene from '../components/Scene/Scene';
import { Dancer } from '../Models/Types';

const { Header, Content } = Layout;

export default function EditorPage() {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuth();
    const [dancers, setDancers] = useState<Dancer[]>([]);

    useEffect(() => {
        if (!user) {
            console.log('Создание нового сценария для гостя...');
        } else {
            console.log('Загрузка проекта пользователя...');
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
        // Находим следующую свободную координату
        const GRID_WIDTH = 32;
        const GRID_HEIGHT = 16;
        const minX = -GRID_WIDTH / 2;
        const maxX = GRID_WIDTH / 2;
        const maxY = GRID_HEIGHT / 2;
        const minY = -GRID_HEIGHT / 2;

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

    return (
        <Layout style={{ height: 'calc(100vh - 64px)' }}>
            <EditorSidebar
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
                onAddDancer={handleAddDancer}
                dancerCount={dancers.length}
            />
            <Layout>
                <Header style={{ padding: 0, background: '#041527' }} />
                <Content style={{ margin: 0, padding: 0, background: '#041527' }}>
                    <Scene dancers={dancers} onMove={handleUpdateDancer} />
                </Content>
            </Layout>
        </Layout>
    );
}