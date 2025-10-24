'use client'
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/auth-context';
import './globals.css';
import { saveDraftToLocalStorage } from './utils/localStorageScenario';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();

    
    const handleTryClick = () => {
    if (!user) {
        // Неавторизован — создаём локальный сценарий
        saveDraftToLocalStorage({
            isPublished: false,
            formations: [{
                id: uuidv4(),
                numberInScenario: 1,
                dancerPositions: [{
                    id: uuidv4(),
                    numberInFormation: 1,
                    position: { x: 0, y: 0 },
                    color: '#C83A77'
                }]
            }],
            dancerCount: 1,
        });

        router.push('/editor');
    } else {
        // Авторизован — сразу в редактор
        router.push('/editor');
    }
};

    return (
        <div className="home-container">
            <div className="glass-panel">
                <h1 style={{ color: '#FFFFFF' }}>Создайте свою хореографию</h1>
                <Button
                    className="btnTry"
                    size="large"
                    onClick={handleTryClick}
                >
                    Попробовать
                </Button>
            </div>
        </div>
    );
}