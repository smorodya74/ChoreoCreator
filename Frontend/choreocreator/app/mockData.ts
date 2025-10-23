import { LoginRequest, User } from "./services/auth";

class MockAuth {
  private currentUser: User | null = {
    username: "TestUser",
    email: "test@example.com",
    role: "user"
  };

  async login(data: LoginRequest): Promise<void> {
    // Имитируем успешный вход с задержкой
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (data.email === "test@example.com" && data.password === "password") {
      this.currentUser = {
        username: "TestUser",
        email: data.email,
        role: "user"
      };
    } else {
      throw new Error("Invalid credentials");
    }
  }

  async logout(): Promise<void> {
    // Имитируем успешный выход с задержкой
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
  }

  get user(): User | null {
    return this.currentUser;
  }
}

export const mockAuth = new MockAuth();