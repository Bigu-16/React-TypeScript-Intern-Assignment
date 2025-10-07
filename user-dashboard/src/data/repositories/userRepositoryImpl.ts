import { UserRepository } from "../../domain/repositories/userRepository";
import { User } from "../../domain/entities/user";
import { userApi } from "../datasources/userApi";

export class UserRepositoryImpl implements UserRepository {
  async getUsers(): Promise<User[]> {
    return await userApi.getUsers();
  }

  async addUser(user: User): Promise<User> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Add a fake ID since there’s no real backend
      const newUser = { ...user, id: Math.floor(Math.random() * 10000) };

      console.log("User added:", newUser);
      return newUser;
    } catch (error) {
      console.error("Failed to add user:", error);
      throw error;
    }
  }
  async updateUser(user: User): Promise<User> {
    throw new Error("Not implemented yet");
  }

  async deleteUser(id: number): Promise<void> {
    throw new Error("Not implemented yet");
  }
}
