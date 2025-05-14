'use client'
import { Button, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/auth-context';
import './globals.css';

const { Title } = Typography;

export default function HomePage() {
    const router = useRouter();
    const { user } = useAuth();

    const handleTryClick = () => {
        // Перенаправление на редактор, который сам решает, что показать
        router.push('/editor');
    };

    return (
        <div className="home-container">
            <Title style={{ color: '#FFFFFF' }} level={1}>Создайте свою хореографию</Title>
            <Button type="primary" size="large" onClick={handleTryClick}>
                Попробовать
            </Button>
        </div>
    );
}