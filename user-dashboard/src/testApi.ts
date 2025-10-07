import { UserRepositoryImpl } from "./data/repositories/userRepositoryImpl";

const userRepo = new UserRepositoryImpl();

async function testGetUsers() {
  try {
    const users = await userRepo.getUsers();
    console.log("✅ Users fetched successfully:");
    console.table(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
  }
}

testGetUsers();
