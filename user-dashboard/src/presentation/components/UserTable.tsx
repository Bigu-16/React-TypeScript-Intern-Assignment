import React, { useState, useEffect } from "react";
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
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import ImportExportIcon from "@mui/icons-material/ImportExport";
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

  // pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // name sorting: null = unsorted, 'asc' or 'desc'
  const [nameSortOrder, setNameSortOrder] = useState<null | "asc" | "desc">(
    null
  );
  const toggleNameSort = () => {
    setNameSortOrder((prev) =>
      prev === null ? "asc" : prev === "asc" ? "desc" : null
    );
  };

  const sortedUsers = React.useMemo(() => {
    if (!nameSortOrder) return filteredUsers;
    return [...filteredUsers].sort((a, b) => {
      const an = a.name.toLowerCase();
      const bn = b.name.toLowerCase();
      if (an < bn) return nameSortOrder === "asc" ? -1 : 1;
      if (an > bn) return nameSortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, nameSortOrder]);

  // reset page when filters/search change so page is valid
  useEffect(() => {
    if (page > 0 && page * rowsPerPage >= filteredUsers.length) {
      setPage(0);
    }
  }, [filteredUsers, page, rowsPerPage]);

  // compute paginated slice from sorted list
  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={(theme) => ({
        background: theme.palette.mode === "light" ? "#eff8ffff" : "#18213a", // unified with table cell
        borderRadius: 1,
        p: 3,
        boxShadow: 1,
        border: `0.5 px solid ${
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
            variant="standard"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            sx={{
              width: 300,
              borderRadius: 1,
              padding: 1,
              background:
          theme.palette.mode === "light" ? "#eff8ffff" : "#18213a",
              color: theme.palette.mode === "light" ? "#023562" : "#e0e0e0",
              boxShadow: 1,
              input: {
          color: theme.palette.mode === "light" ? "#023562" : "#e0e0e0",
              },
              "& .MuiInputBase-input": {
          color: theme.palette.mode === "light" ? "#023562" : "#e0e0e0",
              },
              "& .MuiOutlinedInput-root": { borderRadius: 1 },
              // also ensure underline styles are not visible for standard variant
              "& .MuiInput-underline:before, & .MuiInput-underline:after": {
          borderBottom: "none",
              },
            }}
            InputProps={{
              disableUnderline: true,
              style: {
          color: theme.palette.mode === "light" ? "#023562" : "#e0e0e0",
          borderRadius: 1,
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
              sx={{ color: theme.palette.primary.light, fontWeight: 500 }}
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
        <>
          <TableContainer
            component={Paper}
            sx={(theme) => ({
              borderRadius: 1,
              boxShadow: 1,
              background:
                theme.palette.mode === "light" ? "#f5faff" : "#18213a",
            })}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#023562" }}>
                  <TableCell
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <span>Name</span>
                    <IconButton
                      size="small"
                      onClick={toggleNameSort}
                      sx={{ color: "#fff", p: 0.5 }}
                      aria-label="sort by name"
                    >
                      <ImportExportIcon
                        fontSize="small"
                        sx={{
                          opacity: nameSortOrder ? 1 : 0.6,
                          transform:
                            nameSortOrder === "desc"
                              ? "rotate(180deg)"
                              : "none",
                        }}
                      />
                    </IconButton>
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
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      hover
                      sx={(theme) => ({
                        borderRadius: 3,
                        background:
                          theme.palette.mode === "light"
                            ? "#eff8ffff"
                            : "#18213a",
                        mb: 1,
                      })}
                    >
                      <TableCell sx={{ color: "inherit" }}>
                        {user.name}
                      </TableCell>
                      <TableCell sx={{ color: "inherit" }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-block",
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            background:
                              user.role === "Admin"
                                ? "#1976d2"
                                : user.role === "Manager"
                                ? "#00509e"
                                : "#90caf9",
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

          <Box display="flex" justifyContent="flex-end" mt={1}>
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setRowsPerPage(value);
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Rows per page"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default UserTable;
