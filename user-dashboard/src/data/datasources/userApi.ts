import axios from "axios";
import { User } from "../../domain/entities/user"; // 👈 import from domain

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/users");
    const users = response.data;

    const roles = ["Admin", "User", "Manager"];

    const transformedUsers: User[] = users.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: roles[Math.floor(Math.random() * roles.length)],
    }));

    return transformedUsers;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const userApi = {
  getUsers,
};
