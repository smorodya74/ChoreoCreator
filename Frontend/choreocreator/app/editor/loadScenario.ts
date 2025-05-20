import { mapScenarioResponseToDraft } from "@/app/services/mappers/scenarioMappers";
import { DraftScenario, getDraftFromLocalStorage, saveDraftToLocalStorage } from "../utils/localStorageScenario";
import { getScenarioById } from "../services/scenarios";

export const loadScenario = async (userId?: string): Promise<DraftScenario> => {
    try {
        if (userId) {
            const serverScenario = await getScenarioById(userId);
            const draft = mapScenarioResponseToDraft(serverScenario);
            saveDraftToLocalStorage(draft);
            return draft;
        }
    } catch (err) {
        console.warn("Не удалось загрузить сценарий из API, пробуем localStorage: ", err);
    }

    const local = getDraftFromLocalStorage();
    if (local) return local;

    const newDraft: DraftScenario = {
        title: "",
        description: "",
        isPublished: false,
        dancerCount: 0,
        formations: []
    };

    saveDraftToLocalStorage(newDraft);
    return newDraft;
};
