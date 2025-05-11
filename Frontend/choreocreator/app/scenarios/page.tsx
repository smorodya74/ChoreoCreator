"use client";

import Button from "antd/es/button/button";
import { Scenarios } from "../components/Scenarios";
import { useEffect, useState } from "react";
import { getAllScenarios } from "../services/scenarios";

export default function ScenariosPage(){
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getScenarios = async () => {
            const scenarios = await getAllScenarios();
            setLoading(false);
            setScenarios(scenarios);
        }

        getScenarios();
    }, [])
    
    return (
        <div>
            <Button>Создать сценарий</Button>

            <Scenarios scenarios={scenarios}/>
        </div>
    )
}