'use client';

import { Layout } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import EditorSidebar from '@/app/components/EditorBar/EditorBar';
import { useAuth } from '../context/auth-context';
import Scene from '../components/Scene/Scene';
import { Formation } from '../Models/Types';
import { v4 as uuidv4 } from 'uuid';
import { getDraftFromLocalStorage, saveDraftToLocalStorage } from '../utils/localStorageScenario';
import AuthModal from '../components/AuthModal';

const { Content } = Layout;

export default function EditorPage() {
    const { user } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<null | 'save' | 'publish' | 'export'>(null);

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

    const currentFormation = useMemo(
        () => formations.find(f => f.id === selectedFormationId),
        [formations, selectedFormationId]
    );
    
    const dancers = currentFormation?.dancers ?? [];

    useEffect(() => {
        if (!user) {
            console.log('[LOGGER] Гость: загружаем черновик или создаем новый...');

            const localDraft = getDraftFromLocalStorage();

            if (localDraft) {
                setFormations(localDraft.formations);
                setSelectedFormationId(localDraft.formations[0].id);
                setSelectedDancerId(localDraft.formations[0].dancers[0]?.id ?? null);
                return;
            }
        } else {
            console.log('[LOGGER] Авторизованный пользователь: загружаем сценарий из БД...');
            // Тут позже будет загрузка с сервера
            return;
        }

        // По умолчанию создаем новый сценарий
        const initialFormationId = uuidv4();
        const initialDancerId = uuidv4();
        const defaultFormations = [{
            id: initialFormationId,
            numberInScenario: 1,
            dancers: [{
                id: initialDancerId,
                numberInFormation: 1,
                position: { x: 0, y: 0 },
            }]
        }];

        setFormations(defaultFormations);
        setSelectedFormationId(initialFormationId);
        setSelectedDancerId(initialDancerId);

        saveDraftToLocalStorage({
            isPublished: false,
            formations: defaultFormations,
            dancerCount: 1
        });

    }, [user]);

    useEffect(() => {
        if (user && pendingAction) {
            console.log(`[LOGGER] Пользователь вошёл, но нужно нажать кнопку "${pendingAction}" ещё раз`);
            setPendingAction(null); // сбрасываем, чтобы не повторилось
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            const dancerCount = Math.max(...formations.map(f => f.dancers.length));
            saveDraftToLocalStorage({
                isPublished: false,
                formations,
                dancerCount,
            });
        }
    }, [formations, user]);

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
                            id: uuidv4(),
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

                            saveDraftToLocalStorage({
                                isPublished: false,
                                formations: updated, // после setFormations
                                dancerCount: Math.max(...updated.map(f => f.dancers.length))
                            });

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

                saveDraftToLocalStorage({
                    isPublished: false,
                    formations: updated, // после setFormations
                    dancerCount: Math.max(...updated.map(f => f.dancers.length))
                });

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
                const dancers = formation.dancers;

                const deleteIndex = dancers.findIndex(d => d.id === selectedDancerId);
                if (deleteIndex === -1) return prev;

                const updatedDancers = dancers
                    .filter((_, i) => i !== deleteIndex)
                    .map((d, idx) => ({
                        ...d,
                        numberInFormation: idx + 1,
                    }));

                const updated = [...prev];
                updated[index] = {
                    ...formation,
                    dancers: updatedDancers,
                };

                saveDraftToLocalStorage({
                    isPublished: false,
                    formations: updated, // после setFormations
                    dancerCount: Math.max(...updated.map(f => f.dancers.length))
                });

                // Выбрать предыдущего или следующего
                const newSelectedIndex = deleteIndex > 0 ? deleteIndex - 1 : 0;
                const newSelectedId = updatedDancers[newSelectedIndex]?.id || null;

                setSelectedDancerId(newSelectedId);

                return updated;
            });
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
        const updatedFormations = [...formations, newFormation];
        saveDraftToLocalStorage({
            isPublished: false,
            formations: updatedFormations,
            dancerCount: Math.max(...updatedFormations.map(f => f.dancers.length))
        });
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

            saveDraftToLocalStorage({
                isPublished: false,
                formations: reIndexed,
                dancerCount: Math.max(...reIndexed.map(f => f.dancers.length))
            });

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

    // СОХРАНИТЬ
    const handleSaveScenario = () => {
        if (!user) {
            console.log('[LOGGER] Не авторизован: открываем модалку');
            setPendingAction('save');
            setModalOpen(true); // Твоя модалка
            return;
        }

        console.log('[LOGGER] Авторизован: сохраняем в БД (POST или PUT)');
        // TODO: отправить сценарий в БД
    };  
    
    // ОПУБЛИКОВАТЬ
    const handlePublicScenario = () => {
        if (!user) {
            console.log('[LOGGER] Не авторизован: открываем модалку');
            setPendingAction('publish');
            setModalOpen(true); // Твоя модалка
            return;
        }

        console.log('[LOGGER] Авторизован: публикуем в БД (POST или PUT) isPublish = true');
        // TODO: отправить сценарий в БД
    };   
    
    // ЭКСПОРТИРОВАТЬ
    const handleExportScenario = () => {
        if (!user) {
            console.log('[LOGGER] Не авторизован: открываем модалку');
            setPendingAction('export');
            setModalOpen(true); // Твоя модалка
            return;
        }

        console.log('[LOGGER] Авторизован: экспорт в PDF');
        // TODO: отправить сценарий в БД
    };

    return (
        <>
            <Layout style={{ height: 'calc(100vh - 128px)' }}>
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
                    onSaveScenario={handleSaveScenario}
                    onPublicScenario={handlePublicScenario}
                    onExportScenario={handleExportScenario}
                />

                <Layout style={{ background: '#041527', paddingLeft: 250 }}>
                    <Content
                        style={{
                            marginTop: 25,
                            marginLeft: 25,
                            marginRight: 25,
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
            <AuthModal open={isModalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}