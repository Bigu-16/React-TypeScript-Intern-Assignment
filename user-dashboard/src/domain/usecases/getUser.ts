import { User } from "../entities/user";
import { UserRepository } from "../repositories/userRepository";

export class GetUsers {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }
}