import React, { useState } from "react";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import { useUsers } from "../hooks/useUsers";
import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { User } from "../../domain/entities/user";

interface UserPageProps {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
}

const UserPage: React.FC<UserPageProps> = ({ mode, setMode }) => {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    addUser,
    updateUser,
    deleteUser,
  } = useUsers();

  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // 🔸 Add button clicked
  const handleAdd = () => {
    setSelectedUser(null);
    setOpenForm(true);
  };

  // 🔸 Edit button clicked
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  // 🔸 Delete button clicked
  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  // 🔸 Form submit
  const handleFormSubmit = (user: User) => {
    if (selectedUser) {
      updateUser(user);
    } else {
      addUser(user);
    }
  };

  // 🔸 Confirm delete
  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
    }
    setOpenDeleteDialog(false);
  };

  console.log("UserPage loaded");

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        mb={2}
        gap={2}
      >
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add User
        </Button>
        <Tooltip
          title={
            mode === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          <IconButton
            onClick={() => setMode(mode === "light" ? "dark" : "light")}
            color="primary"
            aria-label="toggle dark mode"
          >
            {mode === "light" ? <NightsStayIcon /> : <WbSunnyIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <UserTable
        users={users}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedUser}
      />

      <ConfirmationDialog
        open={openDeleteDialog}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.name}"?`}
        onCancel={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
};

export default UserPage;
