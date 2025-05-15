"use client";

import Button from "antd/es/button/button";
import { useEffect, useState } from "react";
import { createScenario, deleteScenario, getAllScenarios, ScenarioRequest, updateScenario } from "../services/scenarios";
import Title from "antd/es/typography/Title";
import { CreateUpdateScenario, Mode } from "../components/CreateUpdateScenario";
import ScenariosTable from "../components/ScenariosTable";
import { Scenario } from "../Models/Scenario";

export default function ScenariosPage(){
    const defaultValues = {
        title: "",
        description: "",
        author: "Author",
        dancerCount: 1,
    } as Scenario;

    const [values, setValues] = useState<Scenario>(defaultValues);
    
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState(Mode.Create);
    
    useEffect(() => {
        const getScenarios = async () => {
            const scenarios = await getAllScenarios();
            setLoading(false);
            setScenarios(scenarios);
        }

        getScenarios();
    }, [])

    const handleCreateScenario = async (request: ScenarioRequest) => {
        await createScenario(request);
        closeModal();

        const scenarios = await getAllScenarios();
        setScenarios(scenarios);
    }

    const handleUpdateScenario = async (id: string, request: ScenarioRequest) => {
        await updateScenario(id, request);
        closeModal();

        const scenarios = await getAllScenarios();
        setScenarios(scenarios);
    }

    const handleDeleteScenario = async (id: string) => {
        await deleteScenario(id);
        closeModal();

        const scenarios = await getAllScenarios();
        setScenarios(scenarios);
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setValues(defaultValues);
        setIsModalOpen(false);
    }

    const openEditModal = (scenario: Scenario) => {
        setMode(Mode.Edit);
        setValues(scenario);
        setIsModalOpen(true);
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
                CHOREO DATABASE
            </Title>
            <div
                style={{
                    textAlign: "center",
                    alignContent: "center"
                }}>
                <Button className="btnTry"
                    ghost
                    size="large"
                    onClick={openModal}
                    style={{marginBottom: 20}}
                >
                    Создать сценарий
                </Button>
            </div>

            <CreateUpdateScenario 
                mode={mode} 
                values={values} 
                isModalOpen={isModalOpen} 
                handleCreate={handleCreateScenario} 
                handleUpdate={handleUpdateScenario} 
                handleCancel={closeModal}
            />

            {loading ? (
                <Title style={{color: '#FFFFFF', textAlign: 'center'}}>Загрузка...</Title>
            ) : (
                <>
                        <ScenariosTable
                            scenarios={scenarios}
                            handleOpen={openEditModal}
                            handleDelete={handleDeleteScenario}
                        />
                </>
            )}
        </div>
    )
}