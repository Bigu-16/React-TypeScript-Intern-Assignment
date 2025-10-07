import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { User } from "../../domain/entities/user";

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
  initialData?: User | null;
}

const roles = ["Admin", "User", "Manager"];

const UserForm: React.FC<UserFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    role: roles[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ id: 0, name: "", email: "", role: roles[0] });
    }
  }, [initialData]);

  const handleChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.role) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{initialData ? "Edit User" : "Add User"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={handleChange("name")}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
          />
          <TextField
            label="Role"
            select
            value={formData.role}
            onChange={handleChange("role")}
            required
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained">
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
