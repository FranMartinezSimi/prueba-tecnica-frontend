import * as yup from "yup";

export const loginValidation = yup.object({
  email: yup
    .string()
    .email("Correo electrónico inválido")
    .required("Correo electrónico es requerido"),
  password: yup
    .string()
    .required("Contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/,
      "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"
    ),
});
