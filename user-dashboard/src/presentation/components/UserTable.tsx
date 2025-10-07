import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { User } from "../../domain/entities/user";
import { GetUsers } from "../../domain/usecases/getUser";
import { AddUser } from "../../domain/usecases/addUsers";
import { UpdateUser } from "../../domain/usecases/updateUser";
import { DeleteUser } from "../../domain/usecases/deleteUser";
import { UserRepositoryImpl } from "../../data/repositories/userRepositoryImpl";

interface UserTableProps {
  users: User[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  return (
    <Box sx={{ background: "white", borderRadius: 1, p: 3, boxShadow: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold" color="primary.main">
          User Management
        </Typography>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: 300,
            borderRadius: 1,
            background: "#ffffff",
            boxShadow: 1,
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 1, boxShadow: 4, background: "#f5faff" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#023562" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Role
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{ borderRadius: 3, background: "#ffffff", mb: 1 }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          background:
                            user.role === "Admin"
                              ? "#1976d2"
                              : user.role === "Manager"
                              ? "#071eccff"
                              : "#81cdf6ff",
                          color: "white",
                          fontWeight: 500,
                          fontSize: 13,
                        }}
                      >
                        {user.role}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => onEdit(user)}
                        aria-label="edit"
                        sx={{
                          borderRadius: 2,
                          background: "#e3f2fd",
                          mr: 1,
                          "&:hover": { background: "#bbdefb" },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(user)}
                        aria-label="delete"
                        sx={{
                          borderRadius: 2,
                          background: "#e3f2fd",
                          "&:hover": { background: "#ffcdd2" },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserTable;
