'use client';

import { Layout } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import EditorSidebar from '@/app/components/EditorBar/EditorBar';
import { useAuth } from '../context/auth-context';
import Scene from '../components/Scene/Scene';
import { Formation, ScenarioRequest } from '../Models/Types';
import { v4 as uuidv4 } from 'uuid';
import { DraftScenario, getDraftFromLocalStorage, saveDraftToLocalStorage } from '../utils/localStorageScenario';
import AuthModal from '../components/AuthModal';
import { createScenario, getMyScenario, updateScenario } from '../services/scenarios';
import { CreateUpdateScenario } from '../components/CreateUpdateScenario';

const { Content } = Layout;

export default function EditorPage() {
    const defaultValues = {
        title: "Введите название",
        description: "Введите описание",
    } as ScenarioRequest
    const [isScenarioModalVisible, setScenarioModalVisible] = useState(false);
    const [pendingAction, setPendingAction] = useState<null | 'save' | 'publish' | 'export'>(null);


    const { user } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);

    const [scenarioId, setScenarioId] = useState<string | undefined>(undefined);
    const [scenario, setScenario] = useState<DraftScenario | null>(null);

    const [localScenarioId, setLocalScenarioId] = useState<string>(() => uuidv4()); // генерируем локально при инициализации
    const [dbScenarioId, setDbScenarioId] = useState<string | null>(null); // null пока не сохранили на сервере


    const [formations, setFormations] = useState<Formation[]>([{
        id: uuidv4(),
        numberInScenario: 1,
        dancerPositions: [{
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

    const dancerPositions = currentFormation?.dancerPositions ?? [];

    useEffect(() => {
        const loadScenario = async () => {
            const localDraft = getDraftFromLocalStorage();

            if (user) {
                console.log('[LOGGER] Авторизованный пользователь — загрузим сценарий из БД');

                try {
                    const scenarioFromServer = await getMyScenario();
                    setFormations(scenarioFromServer.formations);
                    setScenarioId(scenarioFromServer.id);
                    setSelectedFormationId(scenarioFromServer.formations[0].id);
                    setSelectedDancerId(scenarioFromServer.formations[0].dancerPositions[0]?.id ?? null);

                    return;
                } catch (error) {
                    console.error('[LOGGER] Ошибка загрузки сценария с сервера:', error);
                }
            }
            
            // 2. Если есть localStorage — загрузим из него
            if (localDraft) {
                console.log('[LOGGER] Загружаем сценарий из localStorage...');
                setFormations(localDraft.formations);
                setScenarioId(localDraft.id);
                setSelectedFormationId(localDraft.selectedFormationId ?? localDraft.formations[0].id);
                setSelectedDancerId(localDraft.selectedDancerId ?? localDraft.formations[0].dancerPositions[0]?.id ?? null);
                return;
            }
            
            // 3. Если ничего нет — создаём новый сценарий
            console.log('[LOGGER] Новый сценарий: создаём');
            const generatedId = uuidv4();
            const initialFormationId = uuidv4();
            const initialDancerId = uuidv4();

            const defaultFormations: Formation[] = [{
                id: initialFormationId,
                numberInScenario: 1,
                dancerPositions: [{
                    id: initialDancerId,
                    numberInFormation: 1,
                    position: { x: 0, y: 0 },
                }],
            }];

            setScenarioId(generatedId);
            setFormations(defaultFormations);
            setSelectedFormationId(initialFormationId);
            setSelectedDancerId(initialDancerId);

            saveDraftToLocalStorage({
                id: generatedId,
                formations: defaultFormations,
                dancerCount: 1,
                isPublished: false,
                selectedFormationId: initialFormationId,
                selectedDancerId: initialDancerId,
            });
        };

        loadScenario();
    }, [user]);

    useEffect(() => {
        if (user && pendingAction) {
            console.log(`[LOGGER] Пользователь вошёл, но нужно нажать кнопку "${pendingAction}" ещё раз`);
            setPendingAction(null);
        }
    }, [user]);

    useEffect(() => {
        if (selectedFormationId && selectedDancerId) {
            const dancerCount = Math.max(...formations.map(f => f.dancerPositions.length));
            saveDraftToLocalStorage({
                id: scenarioId,
                isPublished: false,
                formations,
                dancerCount,
                selectedFormationId,
                selectedDancerId
            });
        }
    }, [formations, user]);

    // ДОБАВИТЬ ТАНЦОРА
    const handleAddDancer = () => {
        if (currentFormation && dancerPositions.length < 16) {
            const GRID_WIDTH = 32;
            const GRID_HEIGHT = 16;
            const minX = -GRID_WIDTH / 2;
            const maxX = GRID_WIDTH / 2;
            const maxY = GRID_HEIGHT / 2;
            const minY = -GRID_HEIGHT / 2;

            for (let y = maxY; y >= minY; y--) {
                for (let x = minX; x <= maxX; x++) {
                    const taken = dancerPositions.some(d => d.position.x === x && d.position.y === y);
                    if (!taken) {
                        const newDancer = {
                            id: uuidv4(),
                            numberInFormation: dancerPositions.length + 1,
                            position: { x, y },
                        };

                        setFormations(prev => {
                            const index = prev.findIndex(f => f.id === selectedFormationId);
                            if (index === -1) return prev;

                            const updated = [...prev];
                            const updatedFormation = { ...updated[index] };
                            updatedFormation.dancerPositions = [...updatedFormation.dancerPositions, newDancer];
                            updated[index] = updatedFormation;

                            if(selectedFormationId && selectedDancerId)
                            {
                                saveDraftToLocalStorage({
                                    isPublished: false,
                                    formations: updated,
                                    dancerCount: Math.max(...updated.map(f => f.dancerPositions.length)),
                                    selectedFormationId,
                                    selectedDancerId
                                });
                            }
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
                const updatedDancers = formation.dancerPositions.map(d =>
                    d.id === id ? { ...d, position: newPosition } : d
                );

                const updated = [...prev];
                updated[index] = {
                    ...formation,
                    dancerPositions: updatedDancers,
                };

                if (selectedFormationId && selectedDancerId) {
                    saveDraftToLocalStorage({
                        isPublished: false,
                        formations: updated,
                        dancerCount: Math.max(...updated.map(f => f.dancerPositions.length)),
                        selectedFormationId,
                        selectedDancerId
                    });
                }

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
        if (selectedDancerId && dancerPositions.length > 1) {
            setFormations(prev => {
                const index = prev.findIndex(f => f.id === selectedFormationId);
                if (index === -1) return prev;

                const formation = prev[index];
                const dancerPositions = formation.dancerPositions;

                const deleteIndex = dancerPositions.findIndex(d => d.id === selectedDancerId);
                if (deleteIndex === -1) return prev;

                const updatedDancers = dancerPositions
                    .filter((_, i) => i !== deleteIndex)
                    .map((d, idx) => ({
                        ...d,
                        numberInFormation: idx + 1,
                    }));

                const updated = [...prev];
                updated[index] = {
                    ...formation,
                    dancerPositions: updatedDancers,
                };

                if (selectedFormationId && selectedDancerId) {
                    saveDraftToLocalStorage({
                        isPublished: false,
                        formations: updated,
                        dancerCount: Math.max(...updated.map(f => f.dancerPositions.length)),
                        selectedFormationId,
                        selectedDancerId
                    });
                }

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
            dancerPositions: lastFormation.dancerPositions.map((d, index) => ({
                id: uuidv4(),
                numberInFormation: index + 1,
                position: { ...d.position },
            })),
        };

        setFormations(prev => [...prev, newFormation]);
        const updatedFormations = [...formations, newFormation];
        if (selectedFormationId && selectedDancerId) {
            saveDraftToLocalStorage({
                isPublished: false,
                formations: updatedFormations,
                dancerCount: Math.max(...updatedFormations.map(f => f.dancerPositions.length)),
                selectedFormationId,
                selectedDancerId
            });
        }

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

            const reIndexed = updated.map((f, index) => ({
                ...f,
                numberInScenario: index + 1,
            }));

            if (selectedFormationId && selectedDancerId) {
                saveDraftToLocalStorage({
                    isPublished: false,
                    formations: updated,
                    dancerCount: Math.max(...updated.map(f => f.dancerPositions.length)),
                    selectedFormationId,
                    selectedDancerId
                });
            }

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
        // Если неавторизованный
        if (!user) {
            console.log('[LOGGER] Не авторизован: открываем модалку авторизации');
            setPendingAction('save');
            setModalOpen(true);
            return;
        }

        // Если сценария нет в БД — откроется CreateUpdateScenario (пользователь введёт title/description)
        if (!dbScenarioId) {
            console.log('[LOGGER] Сценарий отсутствует в БД, открывается модалочка');
            setPendingAction('save');
            setScenarioModalVisible(true); // После будет вызван createScenario()
            return;
        }

        // Если сценарий уже есть в БД — сохраняем без модалки
        console.log('[LOGGER] Сценарий присутствует в БД, отправляется PUT', scenarioId);
        const scenarioRequest: ScenarioRequest = {
            title: defaultValues.title,
            description: defaultValues.description,
            formations,
            dancerCount: Math.max(...formations.map(f => f.dancerPositions.length)),
            isPublished: false,
        };

        updateScenario(dbScenarioId, scenarioRequest);
    };

    // ОПУБЛИКОВАТЬ
    const handlePublicScenario = () => {
        // Если неавторизованный
        if (!user) {
            console.log('[LOGGER] Не авторизован: открываем модалку авторизации');
            setPendingAction('publish');
            setModalOpen(true);
            return;
        }
        
        // Если сценария нет в БД — откроется CreateUpdateScenario
        if (!scenarioId) {
            console.log('[LOGGER] Сценарий отсутствует в БД, открывается модалочка с isPublish = true');
            setPendingAction('publish');
            setScenarioModalVisible(true); // После заполнения будет вызван createScenario()
            return;
        }

        // Если сценарий уже есть в БД — публикуем без модалки
        console.log('[LOGGER] Сценарий присутствует в БД, отправляется PUT с isPublish = true');
        const scenarioRequest: ScenarioRequest = {
            title: defaultValues.title,
            description: defaultValues.description,
            formations,
            dancerCount: Math.max(...formations.map(f => f.dancerPositions.length)),
            isPublished: true,
        };

        updateScenario(scenarioId, scenarioRequest);
    };

    // ЭКСПОРТИРОВАТЬ
    const handleExportScenario = () => {
        if (!user) {
            console.log('[LOGGER] Не авторизован: открываем модалку авторизации');
            setPendingAction('export');
            setModalOpen(true);
            return;
        }

        console.log('[LOGGER] Авторизован: экспорт в PDF');
        // TODO: Экспорт в PDF
    };

    const handleCreateScenario = async (data: { title: string; description: string }) => {
        const dancerCount = Math.max(...formations.map(f => f.dancerPositions.length));

        const request: ScenarioRequest = {
            ...data,
            formations,
            dancerCount,
            isPublished: pendingAction === "publish",
        };

        try {
            const response = await createScenario(request); // допустим, возвращает { id: string, ... }
            setDbScenarioId(response.id); // сохраняем ID из БД
            setScenarioModalVisible(false);
            setPendingAction(null);
        } catch (error) {
            console.error('Ошибка создания сценария:', error);
        }
    };


    return (
        <>
            <Layout style={{ height: 'calc(100vh - 128px)' }}>
                <EditorSidebar
                    dancerCount={dancerPositions.length}
                    dancerPositions={dancerPositions}
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
                            dancerPositions={dancerPositions}
                            onMove={handleUpdateDancer}
                            onSelectDancer={handleSelectDancer}
                            selectedDancerId={selectedDancerId}
                        />
                    </Content>
                </Layout>
            </Layout>
            <AuthModal open={isModalOpen} onClose={() => setModalOpen(false)} />
            <CreateUpdateScenario
                isModalOpen={isScenarioModalVisible}
                handleCancel={() => {
                    setScenarioModalVisible(false);
                    setPendingAction(null);
                }}
                handleCreate={handleCreateScenario}
            />
        </>
    );
}