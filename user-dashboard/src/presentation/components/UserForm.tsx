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
  useTheme,
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
  const theme = useTheme();
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    role: roles[0],
  });
  const [emailError, setEmailError] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ id: 0, name: "", email: "", role: roles[0] });
    }
  }, [initialData]);

  const handleChange =
    (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (field === "email") {
        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailError(
          emailRegex.test(value) ? "" : "Please enter a valid email address"
        );
      }
    };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.role || emailError)
      return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 1,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "primary.main",
          fontWeight: 700,
          textAlign: "center",
          borderRadius: 1,
        }}
      >
        {initialData ? "Edit User" : "Add User"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label={<span>Name </span>}
            value={formData.name}
            onChange={handleChange("name")}
            required
            InputLabelProps={{
              sx: { "& .MuiFormLabel-asterisk": { color: "#d32f2f" } },
            }}
            variant="filled"
            sx={{
              borderRadius: 1,
              background:
                theme.palette.mode === "light" ? "#c7e0fa" : "#101624",
              input: { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiFilledInput-root": {
                borderRadius: 1,
                background: "none",
                boxShadow: "none",
                border: "none",
              },
              "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                { borderBottom: "none" },
            }}
            InputProps={{
              disableUnderline: true,
              style: { color: "#fff", borderRadius: 1 },
            }}
          />
          <TextField
            label={<span>Email </span>}
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
            InputLabelProps={{
              sx: { "& .MuiFormLabel-asterisk": { color: "#d32f2f" } },
            }}
            error={!!emailError}
            helperText={emailError}
            variant="filled"
            sx={{
              borderRadius: 1,
              background:
                theme.palette.mode === "light" ? "#c7e0fa" : "#101624",
              input: { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiFilledInput-root": {
                borderRadius: 1,
                background: "none",
                boxShadow: "none",
                border: "none",
              },
              "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                { borderBottom: "none" },
            }}
            InputProps={{
              disableUnderline: true,
              style: { color: "#fff", borderRadius: 1 },
            }}
          />
          <TextField
            label={<span>Role </span>}
            select
            value={formData.role}
            onChange={handleChange("role")}
            required
            InputLabelProps={{
              sx: { "& .MuiFormLabel-asterisk": { color: "#d32f2f" } },
            }}
            variant="filled"
            sx={{
              borderRadius: 1,
              background:
                theme.palette.mode === "light" ? "#c7e0fa" : "#101624",
              input: { color: "#fff" },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiFilledInput-root": {
                borderRadius: 1,
                background: "none",
                boxShadow: "none",
                border: "none",
              },
              "& .MuiFilledInput-underline:before, & .MuiFilledInput-underline:after":
                { borderBottom: "none" },
            }}
            InputProps={{
              disableUnderline: true,
              style: { color: "#fff", borderRadius: 1 },
            }}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="primary"
          sx={{ borderRadius: 1, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 1, fontWeight: 600 }}
        >
          {initialData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
