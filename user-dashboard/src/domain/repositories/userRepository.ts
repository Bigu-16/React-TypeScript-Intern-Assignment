import { User } from "../entities/user";

export interface UserRepository {
  getUsers(): Promise<User[]>;
  addUser(user: User): Promise<User>;
  updateUser(user: User): Promise<User>;
  deleteUser(id: number): Promise<void>;
}
