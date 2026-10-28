import * as yup from 'yup'

export const emailPattern = /^[^\s@]+@(gmail|hotmail)\.[a-z]{2,}$/i

const emailMessage = 'El correo debe ser @gmail.com o @hotmail.com.'

// Esquemas declarativos de Yup que usa React Hook Form (yupResolver) en los formularios de cuenta.
export const loginSchema = yup.object({
  email: yup.string().trim().required('El correo es obligatorio.').matches(emailPattern, emailMessage),
  password: yup.string().required('La contraseña es obligatoria.').min(8, 'La contraseña debe tener al menos 8 caracteres.'),
}).required()

export const registerSchema = yup.object({
  name: yup.string().trim().required('El nombre es obligatorio.').matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}$/, 'Ingresa un nombre válido de al menos 3 letras.'),
  email: yup.string().trim().required('El correo es obligatorio.').matches(emailPattern, emailMessage),
  password: yup.string()
    .required('La contraseña es obligatoria.')
    .min(8, 'La contraseña debe tener 8 caracteres e incluir letras y números.')
    .matches(/[A-Za-z]/, 'La contraseña debe tener 8 caracteres e incluir letras y números.')
    .matches(/[0-9]/, 'La contraseña debe tener 8 caracteres e incluir letras y números.'),
  confirmPassword: yup.string().required('Confirma tu contraseña.').oneOf([yup.ref('password')], 'Las contraseñas no coinciden.'),
  terms: yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones.'),
}).required()
