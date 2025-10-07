// src/domain/usecases/updateUser.ts
import { User } from "../entities/user";
import { UserRepository } from "../repositories/userRepository";

export class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(user: User): Promise<User> {
    return await this.userRepository.updateUser(user);
  }
}
