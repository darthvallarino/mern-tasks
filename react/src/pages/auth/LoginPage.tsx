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
import { useLoginMutation } from "../../store/auth/authApi";
import { setCredentials } from "../../store/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  nickname: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async ({ nickname, password }: LoginForm) => {
    try {
      const userData = await login({ nickname, password }).unwrap();
      dispatch(
        setCredentials(userData)
      );
      navigate("/tasks");
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
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Usuario"
              variant="outlined"
              margin="normal"
              {...register("nickname", {
                required: "El usuario es obligatorio",
              })}
              error={!!errors.nickname}
              helperText={errors.nickname?.message}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Ingresar
            </Button>
          </form>
          <Box textAlign="center" mt={2}>
            <Typography variant="body2">
              ¿No tienes una cuenta? <Link href="/register">Regístrate aquí</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
