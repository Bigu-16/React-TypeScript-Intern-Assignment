import React, { useState } from "react";
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
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
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

const roles = ["Admin", "User", "Manager"];

const UserTable: React.FC<UserTableProps> = ({
  users,
  loading,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}) => {
  const theme = useTheme();
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleRoleToggle = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term);
    const matchesRole =
      selectedRoles.length === 0 || selectedRoles.includes(user.role);
    return matchesSearch && matchesRole;
  });

  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.mode === "light" ? "#e3f2fd" : "#18213a", // unified with table cell
        borderRadius: 3,
        p: 3,
        boxShadow: 3,
        border: `1.5px solid ${
          theme.palette.mode === "light" ? "#1976d2" : "#023562"
        }`,
        transition: "background 0.3s, border 0.3s",
      })}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: theme.palette.mode === "light" ? "#023562" : "#90caf9",
            letterSpacing: 1,
            textShadow:
              theme.palette.mode === "dark" ? "0 1px 4px #023562" : "none",
          }}
        >
          User Management
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              width: 300,
              borderRadius: 1,
              background:
                theme.palette.mode === "light" ? "#c7e0fa" : "#101624",
              color: "#fff",
              boxShadow: 1,
              input: { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
            }}
            InputProps={{
              style: {
                color: "#fff",
              },
            }}
          />
          <IconButton
            aria-label="filter"
            sx={{
              ml: 1,
              color: theme.palette.mode === "light" ? "#1976d2" : "#90caf9",
              background: "transparent",
              "&:hover": {
                background:
                  theme.palette.mode === "light" ? "#bbdefb" : "#023562",
                color: "#fff",
              },
            }}
            onClick={handleFilterClick}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: 180,
                background: theme.palette.background.paper,
                color: theme.palette.text.primary,
              },
            }}
          >
            <MenuItem disabled sx={{ fontWeight: 700 }}>
              Filter by Role
            </MenuItem>
            {roles.map((role) => (
              <MenuItem
                key={role}
                onClick={() => handleRoleToggle(role)}
                sx={{ pl: 2 }}
              >
                <Checkbox
                  checked={selectedRoles.includes(role)}
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    "&.Mui-checked": {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
                <ListItemText primary={role} />
              </MenuItem>
            ))}
            <MenuItem
              onClick={() => setSelectedRoles([])}
              sx={{ color: theme.palette.secondary.main, fontWeight: 500 }}
            >
              Clear Filters
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={(theme) => ({
            borderRadius: 1,
            boxShadow: 4,
            background: theme.palette.mode === "light" ? "#f5faff" : "#18213a",
          })}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#023562" }}>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                  Role
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ color: "#fff", fontWeight: 600 }}
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
                    sx={(theme) => ({
                      borderRadius: 3,
                      background:
                        theme.palette.mode === "light" ? "#e3f2fd" : "#18213a",
                      mb: 1,
                    })}
                  >
                    <TableCell sx={{ color: "inherit" }}>{user.name}</TableCell>
                    <TableCell sx={{ color: "inherit" }}>
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          background:
                            user.role === "Admin"
                              ? "#1976d2" // main blue
                              : user.role === "Manager"
                              ? "#1565c0" // darker blue
                              : "#90caf9", // light blue
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: 13,
                          letterSpacing: 0.5,
                        }}
                      >
                        {user.role}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="edit"
                        onClick={() => onEdit(user)}
                        sx={{
                          borderRadius: 2,
                          background: "transparent",
                          color: "#1976d2",
                          mr: 1,
                          "&:hover": {
                            background: "#1976d2",
                            color: "#fff",
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(user)}
                        aria-label="delete"
                        sx={(theme) => ({
                          borderRadius: 2,
                          background:
                            theme.palette.mode === "light"
                              ? "#e3f2fd"
                              : "#263859",
                          "&:hover": {
                            background:
                              theme.palette.mode === "light"
                                ? "#ffcdd2"
                                : "#b71c1c",
                          },
                        })}
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
