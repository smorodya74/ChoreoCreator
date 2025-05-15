import { Formation } from "@/app/Models/Types";

export interface DraftScenario {
    id?: string;
    title?: string;
    description?: string;
    isPublished: boolean;
    formations: Formation[];
    dancerCount: number;
}

const DRAFT_KEY = "draftScenario";

export function saveDraftToLocalStorage(draft: DraftScenario) {
    localStorage.setItem('draftScenario', JSON.stringify(draft));
}

export function getDraftFromLocalStorage(): DraftScenario | null {
    const data = localStorage.getItem('draftScenario');
    return data ? JSON.parse(data) : null;
}

export function clearDraftFromLocalStorage() {
    localStorage.removeItem(DRAFT_KEY);
}