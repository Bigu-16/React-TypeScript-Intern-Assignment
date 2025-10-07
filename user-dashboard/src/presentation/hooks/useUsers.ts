import { useEffect, useState } from "react";
import { User } from "../../domain/entities/user";
import { GetUsers } from "../../domain/usecases/getUser";
import { UpdateUser } from "../../domain/usecases/updateUser";
import { AddUser } from "../../domain/usecases/addUsers";
import { DeleteUser } from "../../domain/usecases/deleteUser";
import { UserRepositoryImpl } from "../../data/repositories/userRepositoryImpl";

// TODO: Implement AddUser use case and import it here

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // instantiate repository and use cases
  const repository = new UserRepositoryImpl();
  const getUsersUC = new GetUsers(repository);
  const addUserUC = new AddUser(repository);
  const updateUserUC = new UpdateUser(repository);
  const deleteUserUC = new DeleteUser(repository);

  // 🔸 Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await getUsersUC.execute();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  // 🔸 Add user
  async function addUser(user: User) {
    try {
      // Assign a random role to the new user (mock, like in userApi)
      const roles = ["Admin", "User", "Manager"];
      const userWithRole = {
        ...user,
        role: user.role || roles[Math.floor(Math.random() * roles.length)],
      };
      const newUser = await addUserUC.execute(userWithRole);
      setUsers((prev) => [...prev, newUser]);
    } catch (err) {
      console.error(err);
      setError("Failed to add user");
    }
  }

  // 🔸 Update user
  async function updateUser(updatedUser: User) {
    try {
      const newUser = await updateUserUC.execute(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === newUser.id ? newUser : u)));
    } catch (err) {
      console.error(err);
      setError("Failed to update user");
    }
  }

  // 🔸 Delete user
  async function deleteUser(id: number) {
    try {
      await deleteUserUC.execute(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user");
    }
  }

  // 🔸 Filtered users (search)
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  return {
    users: filteredUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
}
