// app/utils/mockData.ts

// ====== АУТЕНТИФИКАЦИЯ ======
export const mockAuth = {
  user: {
    username: "testuser",
    email: "test@example.com",
    role: "user",
    createdAt: new Date().toISOString()
  },

  login: async (data: { email: string; password: string }): Promise<void> => {
    console.log("[MOCK] Login attempt:", data);
    
    // Простая валидация для тестирования
    if (!data.email || !data.password) {
      throw new Error("Email and password are required");
    }
    
    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }
    
    // Симулируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Успешный логин
    return;
  },

  register: async (data: { email: string; username: string; password: string }): Promise<void> => {
    console.log("[MOCK] Register attempt:", data);

    if (!data.email || !data.username || !data.password) {
      throw new Error("Email, username and password are required");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    await new Promise(resolve => setTimeout(resolve, 300));

    mockAuth.user = {
      username: data.username,
      email: data.email,
      role: "user",
      createdAt: new Date().toISOString()
    };

    return;
  },
  
  logout: async (): Promise<void> => {
    console.log("[MOCK] Logout");
    await new Promise(resolve => setTimeout(resolve, 150));
    return;
  }
};

// ====== ИМПОРТ РЕАЛЬНЫХ ТИПОВ ======
import type { 
  ScenarioRequest as RealScenarioRequest, 
  ScenarioResponse as RealScenarioResponse,
  Formation as RealFormation,
  DancerPosition as RealDancerPosition,
  Position as RealPosition
} from "../Models/Types";

// ====== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ======
// Создаем позицию
const createPosition = (x: number, y: number): RealPosition => ({
  x,
  y
});

// Создаем позицию танцора
const createDancerPosition = (
  id: string, 
  numberInFormation: number, 
  position: RealPosition
): RealDancerPosition => ({
  id,
  numberInFormation,
  position
});

// Создаем формирование
const createFormation = (
  id: string, 
  numberInScenario: number, 
  dancerPositions: RealDancerPosition[]
): RealFormation => ({
  id,
  numberInScenario,
  startTimeMs: (numberInScenario - 1) * 10000,
  durationMs: 10000,
  animationDurationMs: 5000,
  name: `Formation-${numberInScenario}`,
  description: "",
  isAutoName: true,
  dancerPositions
});

// ====== СЦЕНАРИИ ======
class MockScenarioStore {
  private scenarios: RealScenarioResponse[] = [];
  private nextId = 1;

  constructor() {
    // Инициализируем тестовые данные с правильными полями
    this.scenarios = [
      {
        id: "1",
        title: "Сценарий 1: Базовый анализ",
        description: "Первый тестовый сценарий для демонстрации",
        username: "user1",
        dancerCount: 5,
        isPublished: true,
        totalDurationMs: 10000,
        formations: [
          createFormation("formation-1", 1, [
            createDancerPosition("d1", 1, createPosition(0, 0)),
            createDancerPosition("d2", 2, createPosition(1, 0)),
            createDancerPosition("d3", 3, createPosition(0, 1)),
            createDancerPosition("d4", 4, createPosition(1, 1)),
            createDancerPosition("d5", 5, createPosition(0.5, 0.5))
          ])
        ]
      },
      {
        id: "2",
        title: "Сценарий 2: Расширенный анализ",
        description: "Второй сценарий с более сложной логикой",
        username: "user2",
        dancerCount: 8,
        isPublished: false,
        totalDurationMs: 20000,
        formations: [
          createFormation("formation-1", 1, [
            createDancerPosition("d1", 1, createPosition(0, 0)),
            createDancerPosition("d2", 2, createPosition(2, 0)),
            createDancerPosition("d3", 3, createPosition(0, 2)),
            createDancerPosition("d4", 4, createPosition(2, 2)),
            createDancerPosition("d5", 5, createPosition(1, 0)),
            createDancerPosition("d6", 6, createPosition(1, 2)),
            createDancerPosition("d7", 7, createPosition(0, 1)),
            createDancerPosition("d8", 8, createPosition(2, 1))
          ]),
          createFormation("formation-2", 2, [
            createDancerPosition("d1", 1, createPosition(0.5, 0.5)),
            createDancerPosition("d2", 2, createPosition(1.5, 0.5)),
            createDancerPosition("d3", 3, createPosition(0.5, 1.5)),
            createDancerPosition("d4", 4, createPosition(1.5, 1.5)),
            createDancerPosition("d5", 5, createPosition(1, 0)),
            createDancerPosition("d6", 6, createPosition(1, 2)),
            createDancerPosition("d7", 7, createPosition(0, 1)),
            createDancerPosition("d8", 8, createPosition(2, 1))
          ])
        ]
      },
      {
        id: "3",
        title: "Сценарий 3: Прогнозирование",
        description: "Сценарий для прогнозирования трендов",
        username: "user1",
        dancerCount: 12,
        isPublished: true,
        totalDurationMs: 10000,
        formations: [
          createFormation("formation-1", 1, [
            createDancerPosition("d1", 1, createPosition(0, 0)),
            createDancerPosition("d2", 2, createPosition(0, 1)),
            createDancerPosition("d3", 3, createPosition(0, 2)),
            createDancerPosition("d4", 4, createPosition(0, 3)),
            createDancerPosition("d5", 5, createPosition(1, 0)),
            createDancerPosition("d6", 6, createPosition(1, 1)),
            createDancerPosition("d7", 7, createPosition(1, 2)),
            createDancerPosition("d8", 8, createPosition(1, 3)),
            createDancerPosition("d9", 9, createPosition(2, 0)),
            createDancerPosition("d10", 10, createPosition(2, 1)),
            createDancerPosition("d11", 11, createPosition(2, 2)),
            createDancerPosition("d12", 12, createPosition(2, 3))
          ]),
          createFormation("formation-2", 2, [
            createDancerPosition("d1", 1, createPosition(0, 0)),
            createDancerPosition("d2", 2, createPosition(1, 1)),
            createDancerPosition("d3", 3, createPosition(2, 0)),
            createDancerPosition("d4", 4, createPosition(3, 1)),
            createDancerPosition("d5", 5, createPosition(0.5, 1.5)),
            createDancerPosition("d6", 6, createPosition(1.5, 2.5)),
            createDancerPosition("d7", 7, createPosition(2.5, 1.5)),
            createDancerPosition("d8", 8, createPosition(3.5, 0.5)),
            createDancerPosition("d9", 9, createPosition(1, 0)),
            createDancerPosition("d10", 10, createPosition(2, 1)),
            createDancerPosition("d11", 11, createPosition(0, 2)),
            createDancerPosition("d12", 12, createPosition(3, 2))
          ])
        ]
      }
    ];
    this.nextId = 4;
  }

  get list(): RealScenarioResponse[] {
    return [...this.scenarios];
  }

  create = async (scenarioRequest: RealScenarioRequest): Promise<RealScenarioResponse> => {
    console.log("[MOCK] Creating scenario:", scenarioRequest);
    
    await new Promise(resolve => setTimeout(resolve, 400)); // Имитация задержки
    
    const newScenario: RealScenarioResponse = {
      id: this.nextId.toString(),
      title: scenarioRequest.title,
      description: scenarioRequest.description,
      username: mockAuth.user.username,
      dancerCount: scenarioRequest.dancerCount,
      isPublished: scenarioRequest.isPublished,
      totalDurationMs: scenarioRequest.totalDurationMs,
      formations: scenarioRequest.formations.map((formation, index) => ({
        ...formation,
        numberInScenario: index + 1,
        dancerPositions: formation.dancerPositions.map((dp, dpIndex) => ({
          ...dp,
          numberInFormation: dpIndex + 1
        }))
      }))
    };
    
    this.scenarios.push(newScenario);
    this.nextId++;
    
    return newScenario;
  };

  update = async (id: string, scenarioRequest: RealScenarioRequest): Promise<RealScenarioResponse> => {
    console.log("[MOCK] Updating scenario:", id, scenarioRequest);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.scenarios.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`Scenario with id ${id} not found`);
    }
    
    const updatedScenario: RealScenarioResponse = {
      ...this.scenarios[index],
      title: scenarioRequest.title,
      description: scenarioRequest.description,
      dancerCount: scenarioRequest.dancerCount,
      isPublished: scenarioRequest.isPublished,
      totalDurationMs: scenarioRequest.totalDurationMs,
      formations: scenarioRequest.formations.map((formation, formationIndex) => ({
        ...formation,
        numberInScenario: formationIndex + 1,
        dancerPositions: formation.dancerPositions.map((dp, dpIndex) => ({
          ...dp,
          numberInFormation: dpIndex + 1
        }))
      }))
    };
    
    this.scenarios[index] = updatedScenario;
    
    return updatedScenario;
  };

  delete = async (id: string): Promise<void> => {
    console.log("[MOCK] Deleting scenario:", id);
    
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.scenarios.findIndex(s => s.id === id);
    
    if (index === -1) {
      throw new Error(`Scenario with id ${id} not found`);
    }
    
    this.scenarios.splice(index, 1);
  };

  findById = (id: string): RealScenarioResponse | undefined => {
    return this.scenarios.find(s => s.id === id);
  };

  getMyScenario = (): RealScenarioResponse => {
    // Возвращает первый сценарий текущего пользователя или создает новый
    const userScenario = this.scenarios.find(s => s.username === mockAuth.user.username);
    
    if (userScenario) {
      return userScenario;
    }
    
    // Если нет сценария, создаем новый
    const defaultFormation: RealFormation = {
      id: "default-formation",
      numberInScenario: 1,
      startTimeMs: 0,
      durationMs: 10000,
      animationDurationMs: 5000,
      name: "Formation-1",
      description: "",
      isAutoName: true,
      dancerPositions: Array.from({ length: 4 }, (_, i) => 
        createDancerPosition(`d${i + 1}`, i + 1, createPosition(i % 2, Math.floor(i / 2)))
      )
    };
    
    return {
      id: "user-scenario",
      title: "Мой сценарий",
      description: "Персональный сценарий пользователя",
      username: mockAuth.user.username,
      dancerCount: 4,
      isPublished: false,
      totalDurationMs: 10000,
      formations: [defaultFormation]
    };
  };
}

export const mockScenarios = new MockScenarioStore();

// ====== ДОПОЛНИТЕЛЬНЫЕ МОК-ДАННЫЕ ======

export const mockUsers = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin"
  },
  {
    id: "2",
    username: "user",
    email: "user@example.com",
    role: "user"
  }
];

// Экспортируем для удобства
export default {
  mockAuth,
  mockScenarios,
  mockUsers
};