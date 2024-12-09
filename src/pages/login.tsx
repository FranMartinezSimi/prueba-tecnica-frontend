import { useFormik } from "formik";
import { Alert, Box, Button, CircularProgress, Container, IconButton, TextField, Typography } from "@mui/material";
import { loginValidation } from "../validations/login.validation";
import { useAuth } from "../hooks/usAuth";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { AuthContext } from "../context/auth.context";

export default function Login() {
    const { loginAxios, loading } = useAuth();
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: loginValidation,
        onSubmit: async (values: {email: string, password: string}) => {
            try {
                setError(null);
                const response = await loginAxios(values.email, values.password);
                if (response.status === 200) {
                    console.log(response.data.data.access_token);
                    login(response?.data?.data?.access_token);
                    navigate("/dashboard", { replace: true });
                }
            } catch (err: unknown) {
                const error = err as { response?: { data?: { message?: string } } };
                setError(error.response?.data?.message || "Error al iniciar sesión");
            }
        }
    });

    return (
        <Container component="main" maxWidth="xs" data-testid="login-container">
            <Box
                sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: '100vh',
                justifyContent: 'center',
                width: '100%'
            }}>
            {
                error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )
            }
            <Typography component="h1" variant="h5">
                Iniciar Sesión prueba tecnica
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    name="email"
                    autoComplete="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    autoFocus
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    data-testid="email-input"
                />
                {formik.touched.email && formik.errors.email && (
                    <Typography color="error">{formik.errors.email}</Typography>
                )}
                <TextField
                    margin="normal"
                    fullWidth
                    name="password"
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    data-testid="password-input"
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />
                {formik.touched.password && formik.errors.password && (
                    <Typography color="error">{formik.errors.password}</Typography>
                )}
                {
                    loading ? (
                        <CircularProgress />
                    ) : (
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} data-testid="login-button">Iniciar Sesión</Button>
                    )
                }
            </Box>
        </Box>
    </Container>
    )
}
