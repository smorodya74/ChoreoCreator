import { ScenarioResponse } from "@/app/Models/Types";
import { DraftScenario } from "@/app/utils/localStorageScenario";

export const mapScenarioResponseToDraft = (data: ScenarioResponse): DraftScenario => ({
    id: data.id,
    title: data.title,
    description: data.description,
    dancerCount: data.dancerCount,
    isPublished: data.isPublished,
    formations: data.formations,
});