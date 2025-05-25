"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import AuthModal from "@/app/components/AuthModal";
import Title from "antd/es/typography/Title";

export default function ProfilePage() {
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Если не авторизован
        if (!user) {
            setShowAuthModal(true);
            setAuthChecked(false);
        } else {
            // Авторизован - проверяем роль
            console.log("Роль", user.username, "-", user.role);

            setShowAuthModal(false);
            setAuthChecked(true);

        }
    }, [user]);

    // Обработчик закрытия модалки
    const handleCloseModal = () => {
        // Если пользователь не авторизован, модалка не должна закрываться без авторизации
        if (!user) {
            // Можно не закрывать или закрывать, но не показывать профиль (оставаться в том же состоянии)
            alert("Авторизация обязательна для доступа к профилю");
            // НЕ скрываем модалку
            return;
        }
        setShowAuthModal(false);
    };

    if (showAuthModal) {
        return (
            <AuthModal open={showAuthModal} onClose={handleCloseModal} />
        );
    }

    if (!authChecked) {
        // Пока не проверили авторизацию и роль — можно показывать спиннер или пустой экран
        return <div>Загрузка...</div>;
    }

    return (
        <>
            <div>
                <Title
                    style={{
                        padding: 15,
                        color: '#FFFFFF',
                        textAlign: "center"
                    }}
                    level={1}
                >
                    PROFILE PAGE
                </Title>
                <p>Добро пожаловать, {user?.username}</p>
                <p>Ваша роль: {user?.role}</p>
            </div>
        </>
    );
}