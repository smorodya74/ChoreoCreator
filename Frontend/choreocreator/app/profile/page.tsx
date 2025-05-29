"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import AuthModal from "@/app/components/AuthModal";
import Title from "antd/es/typography/Title";
import UsersTable from "../components/UsersTable";
import { changePassword } from "../services/users";
import { message } from "antd";

export default function ProfilePage() {
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (!user) {
            setShowAuthModal(true);
            setAuthChecked(false);
        } else {
            console.log("Роль", user.username, "-", user.role);

            setShowAuthModal(false);
            setAuthChecked(true);

        }
    }, [user]);

    const handleCloseModal = () => {
        if (!user) {
            alert("Авторизация обязательна для доступа к профилю");
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
        return <div>Загрузка...</div>;
    }

    const handleChangePassword = async () => {
        if (!user) return;

        if (!currentPassword || !newPassword || !repeatNewPassword) {
            message.info("Пожалуйста, заполните все поля");
            return;
        }

        if (newPassword !== repeatNewPassword) {
            message.info("Новый пароль и повтор пароля не совпадают");
            return;
        }

        try {
            setIsChangingPassword(true);
            await changePassword(currentPassword, newPassword);
            message.success("Пароль успешно изменен");

            setCurrentPassword("");
            setNewPassword("");
            setRepeatNewPassword("");
        } catch (error) {
            message.error(`Ошибка: ${(error as Error).message}`);
        } finally {
            setIsChangingPassword(false);
        }
    };

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
                    Профиль
                </Title>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px' }}>
                <div style={{
                    flex: 1,
                    maxWidth: 400,
                    border: '3px solid #c83a77',
                    padding: 15,
                    borderRadius: 8,
                    marginRight: 15
                }}
                >
                    <Title
                        level={4}
                        style={{
                            color: "#FFFFFF",
                            textAlign: "center",
                            marginTop: '-5px',
                            marginBottom: '15px'

                        }}
                    >
                        Сменить пароль
                    </Title>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <input
                            type="password"
                            placeholder="Введите пароль"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            style={{
                                padding: 14,
                                borderRadius: 8,
                                border: '1px solid #FFFFFF'
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Введите новый пароль"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            style={{
                                padding: 14,
                                borderRadius: 8,
                                border: '1px solid #FFFFFF'
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Повторите новый пароль"
                            value={repeatNewPassword}
                            onChange={(e) => setRepeatNewPassword(e.target.value)}
                            style={{
                                padding: 14,
                                borderRadius: 8,
                                border: '1px solid #FFFFFF'
                            }}
                        />
                        <button
                            className="btnChangePassword"
                            onClick={handleChangePassword}
                            style={{
                                padding: '14px 16px',
                                color: '#fff',
                                borderRadius: 8,
                                cursor: 'pointer'
                            }}>
                            Сменить пароль
                        </button>
                    </div>
                </div>

                {user?.role === "Admin" && (
                    <div
                        style={{
                            flex: 1,
                            maxWidth: 1400,
                            border: '3px solid #c83a77',
                            padding: 15,
                            borderRadius: 8,
                            marginRight: 15
                        }}
                    >
                        <Title
                            level={4}
                            style={{
                                color: "#FFFFFF",
                                textAlign: "center",
                                marginTop: '-5px',
                                marginBottom: '15px'

                            }}
                        >
                            Пользователи
                        </Title>
                        <UsersTable />
                    </div>
                )}
            </div>
        </>
    );
}