import { userApi } from "./data/datasources/userApi";

async function testApi() {
  const users = await userApi.getUsers();
  console.log("✅ Users fetched successfully:", users);
}

testApi();
