import axios from "axios";
import { API_BASE_URL } from "../../core/constants/apiConstants";
import { User } from "../../domain/entities/user";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
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
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error(
        "Request timed out. Please check your network connection or the API endpoint."
      );
    } else {
      console.error("Failed to fetch users:", error);
    }
    throw error;
  }
};

export const userApi = { getUsers };
