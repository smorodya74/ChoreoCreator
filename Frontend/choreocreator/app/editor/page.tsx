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
import { Mode } from '../components/CreateUpdateScenario';
import { getScenarioById, updateScenario } from '../services/scenarios';

const { Content } = Layout;

export default function EditorPage() {
    const defaultValues = {
        title: "Введите название",
        description: "Введите описание",
    } as ScenarioRequest
    const [isScenarioModalVisible, setScenarioModalVisible] = useState(false);
    const [scenarioMode, setScenarioMode] = useState<Mode>(Mode.Save);
    const [pendingAction, setPendingAction] = useState<null | 'save' | 'publish' | 'export'>(null);


    const { user } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);

    const [scenarioId, setScenarioId] = useState<string | undefined>(undefined);
    const [scenario, setScenario] = useState<DraftScenario | null>(null);

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
        const loadScenario = async () => {
            const localDraft = getDraftFromLocalStorage();

            // 1. Если есть localStorage — загружаем из него независимо от user
            if (localDraft) {
                console.log('[LOGGER] Загружаем сценарий из localStorage...');
                setFormations(localDraft.formations);
                setScenarioId(localDraft.id);
                setSelectedFormationId(localDraft.selectedFormationId ?? localDraft.formations[0].id);
                setSelectedDancerId(localDraft.selectedDancerId ?? localDraft.formations[0].dancers[0]?.id ?? null);
                return;
            }

            // 2. Если пользователь авторизован — загрузи сценарий из БД
            if (user) {
                console.log('[LOGGER] Авторизованный пользователь — загрузи сценарий из БД');

                // Здесь нужно знать scenarioId, который хочешь загрузить
                // Если у тебя нет scenarioId — можно получить "последний" сценарий пользователя, или создать новый
                // Пока пример с фиксированным scenarioId — замени на реальный
                const serverScenarioId = scenarioId ?? "тут_вставь_нужный_id_или получи сессией";

                try {
                    const scenarioFromServer = await getScenarioById(serverScenarioId);
                    setFormations(scenarioFromServer.formations);
                    setScenarioId(scenarioFromServer.id);
                    setSelectedFormationId(scenarioFromServer.formations[0].id);
                    setSelectedDancerId(scenarioFromServer.formations[0].dancers[0]?.id ?? null);
                    return;
                } catch (error) {
                    console.error('[LOGGER] Ошибка загрузки сценария с сервера:', error);
                    // Создаём новый, если загрузка не удалась
                }
            }

            // 3. Если ничего нет — создаём новый сценарий
            console.log('[LOGGER] Новый сценарий: создаём');
            const generatedId = uuidv4();
            const initialFormationId = uuidv4();
            const initialDancerId = uuidv4();

            const defaultFormations: Formation[] = [{
                id: initialFormationId,
                numberInScenario: 1,
                dancers: [{
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
            setPendingAction(null); // сбрасываем, чтобы не повторилось
        }
    }, [user]);

    useEffect(() => {
        if (!user && selectedFormationId && selectedDancerId) {
            const dancerCount = Math.max(...formations.map(f => f.dancers.length));
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

                            if(!user && selectedFormationId && selectedDancerId)
                            {
                                saveDraftToLocalStorage({
                                    isPublished: false,
                                    formations: updated,
                                    dancerCount: Math.max(...updated.map(f => f.dancers.length)),
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
                const updatedDancers = formation.dancers.map(d =>
                    d.id === id ? { ...d, position: newPosition } : d
                );

                const updated = [...prev];
                updated[index] = {
                    ...formation,
                    dancers: updatedDancers,
                };

                if (!user && selectedFormationId && selectedDancerId) {
                    saveDraftToLocalStorage({
                        isPublished: false,
                        formations: updated,
                        dancerCount: Math.max(...updated.map(f => f.dancers.length)),
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

                if (!user && selectedFormationId && selectedDancerId) {
                    saveDraftToLocalStorage({
                        isPublished: false,
                        formations: updated,
                        dancerCount: Math.max(...updated.map(f => f.dancers.length)),
                        selectedFormationId,
                        selectedDancerId
                    });
                }

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
        if (!user && selectedFormationId && selectedDancerId) {
            saveDraftToLocalStorage({
                isPublished: false,
                formations: updatedFormations,
                dancerCount: Math.max(...updatedFormations.map(f => f.dancers.length)),
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

            // Переиндексация numberInScenario
            const reIndexed = updated.map((f, index) => ({
                ...f,
                numberInScenario: index + 1,
            }));

            if (!user && selectedFormationId && selectedDancerId) {
                saveDraftToLocalStorage({
                    isPublished: false,
                    formations: updated,
                    dancerCount: Math.max(...updated.map(f => f.dancers.length)),
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
            console.log('[LOGGER] Не авторизован: открываем модалку');
            setPendingAction('save');
            setModalOpen(true);
            return;
        }

        // Если авторизованный
        console.log('[LOGGER] Авторизован: сохраняем в БД (POST или PUT)');

        // Если сценария нет в БД — откроется CreateUpdateScenario (пользователь введёт title/description)
        if (!scenarioId) {
            setPendingAction('save');
            setScenarioMode(Mode.Save);
            setScenarioModalVisible(true); // После заполнения будет вызван createScenario()
            return;
        }

        // Если сценарий уже есть в БД — сохраняем без модалки
        const scenarioRequest: ScenarioRequest = {
            title: defaultValues.title,
            description: defaultValues.description,
            formations,
            dancerCount: Math.max(...formations.map(f => f.dancers.length)),
            isPublished: false,
        };

        updateScenario(scenarioId, scenarioRequest);
    };

    // ОПУБЛИКОВАТЬ
    const handlePublicScenario = () => {
        // Если неавторизованный
        if (!user) {
            console.log('[LOGGER] Не авторизован: открываем модалку');
            setPendingAction('publish');
            setScenarioMode(Mode.Publish);
            setModalOpen(true);
            return;
        }

        // Если авторизованный
        console.log('[LOGGER] Авторизован: публикуем в БД (POST или PUT) isPublish = true');

        // Если сценария нет в БД — откроется CreateUpdateScenario
        if (!scenarioId) {
            setPendingAction('publish');
            setScenarioMode(Mode.Publish);
            setScenarioModalVisible(true); // После заполнения будет вызван createScenario()
            return;
        }

        // Если сценарий уже есть в БД — публикуем без модалки
        const scenarioRequest: ScenarioRequest = {
            title: defaultValues.title,
            description: defaultValues.description,
            formations,
            dancerCount: Math.max(...formations.map(f => f.dancers.length)),
            isPublished: true,
        };

        updateScenario(scenarioId, scenarioRequest);
    };

    // ЭКСПОРТИРОВАТЬ
    const handleExportScenario = () => {
        if (!user) {
            console.log('[LOGGER] Не авторизован: открываем модалку');
            setPendingAction('export');
            setModalOpen(true);
            return;
        }

        console.log('[LOGGER] Авторизован: экспорт в PDF');
        // TODO: Экспорт в PDF
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