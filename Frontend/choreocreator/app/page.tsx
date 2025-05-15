'use client'
import { Button, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/auth-context';
import './globals.css';
import { saveDraftToLocalStorage } from './utils/localStorageScenario';
import { v4 as uuidv4 } from 'uuid';

const { Title } = Typography;

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
                dancers: [{
                    id: uuidv4(),
                    numberInFormation: 1,
                    position: { x: 0, y: 0 }
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
            <Title style={{ color: '#FFFFFF' }} level={1}>Создайте свою хореографию</Title>
            <Button
                className="btnTry"
                size="large"
                onClick={handleTryClick}
            >
                Попробовать
            </Button>
        </div>
    );
}