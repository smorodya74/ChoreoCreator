"use client";

import Button from "antd/es/button/button";
import { useEffect, useState } from "react";
import { deleteScenario, getAllScenarios } from "../services/scenarios";
import Title from "antd/es/typography/Title";
import ScenariosTable from "../components/ScenariosTable";
import { ScenarioResponse } from "../Models/Types";
import { useRouter } from "next/navigation";
import message from "antd/es/message";

export default function ScenariosPage(){
    
    const [scenarios, setScenarios] = useState<ScenarioResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        const getScenarios = async () => {
            const scenarios = await getAllScenarios();
            setLoading(false);
            setScenarios(scenarios);
        }

        getScenarios();
    }, [])

    const handleDeleteScenario = async (id: string) => {
        try {
            await deleteScenario(id);
            message.success("Сценарий успешно удалён");
            const scenarios = await getAllScenarios();
            setScenarios(scenarios);
        } catch (error) {
            message.error(
                error instanceof Error
                    ? error.message
                    : "Произошла ошибка при удалении сценария"
            );
        }
    }

    return (
        <div>
            <Title
                style={{
                    padding: 15,
                    color: '#FFFFFF',
                    textAlign: "center"
                }}
                level={1}
            >
                База сценариев
            </Title>
            <div
                style={{
                    textAlign: "center",
                    alignContent: "center"
                }}>
                <Button className="btnTry"
                    ghost
                    size="large"
                    onClick={() => router.push('/editor')}
                    style={{marginBottom: 20}}
                >
                    Создать сценарий
                </Button>
            </div>

            {loading ? (
                <Title style={{color: '#FFFFFF', textAlign: 'center'}}>Загрузка...</Title>
            ) : (
                <>
                        <ScenariosTable
                            scenarios={scenarios}
                            handleDelete={handleDeleteScenario}
                        />
                </>
            )}
        </div>
    )
}