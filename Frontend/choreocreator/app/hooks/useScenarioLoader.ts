import { useEffect, useState } from "react";
import { getMe } from "../services/auth";
import { getAllScenarios } from "../services/scenarios";
import { ScenarioResponse } from "../Models/Types";

const DRAFT_STORAGE_KEY = "draftScenario";

export const useScenarioLoader = () => {
    const [scenario, setScenario] = useState<ScenarioResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<"db" | "local" | null>(null);

    useEffect(() => {
        const loadScenario = async () => {
            try {
                const user = await getMe();

                if (user) {
                    const scenarios = await getAllScenarios();

                    if (scenarios.length > 0) {
                        setScenario(scenarios[0]);
                        setSource("db");
                    } else {
                        const local = localStorage.getItem(DRAFT_STORAGE_KEY);
                        if (local) {
                            setScenario(JSON.parse(local));
                            setSource("local");
                        }
                    }
                } else {
                    const local = localStorage.getItem(DRAFT_STORAGE_KEY);
                    if (local) {
                        setScenario(JSON.parse(local));
                        setSource("local");
                    }
                }
            } catch (error) {
                console.error("Ошибка загрузки сценария: ", error);
            } finally {
                setLoading(false);
            }
        };

        loadScenario();
    }, []);

    return { scenario, loading, source };
};
