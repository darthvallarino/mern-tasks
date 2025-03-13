import React from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../../store/auth/authApi";
import { useNavigate } from "react-router-dom";

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>();
  const [registerUser] = useRegisterMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({ nickname: data.username, password: data.password }).unwrap();
      alert("Usuario registrado correctamente");
      navigate("/login");
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Card sx={{ maxWidth: 400, width: "90%", padding: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Registro
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Usuario"
              variant="outlined"
              margin="normal"
              {...register("username", {
                required: "El usuario es obligatorio",
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("password", {
                required: "La contraseña es obligatoria",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              variant="outlined"
              margin="normal"
              {...register("confirmPassword", {
                required: "Debes confirmar tu contraseña",
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Registrarse
            </Button>
          </form>
          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login">Inicia sesión aquí</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
