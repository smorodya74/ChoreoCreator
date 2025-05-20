import { Formation } from "@/app/Models/Types";

const DRAFT_STORAGE_KEY = "draftScenario";

export interface DraftScenario {
    id?: string;
    title?: string;
    description?: string;
    dancerCount: number;
    isPublished: boolean;
    formations: Formation[];
    selectedFormationId?: string;
    selectedDancerId?: string;
}

export const getDraftFromLocalStorage = (): DraftScenario | null => {
    try {
        const data = localStorage.getItem(DRAFT_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Ошибка при чтении черновика из localStorage:', e);
        return null;
    }
};


export const saveDraftToLocalStorage = (draft: DraftScenario) => {
    try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
        console.error('Ошибка при сохранении черновика в localStorage:', e);
    }
};


export const clearDraftFromLocalStorage = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
};