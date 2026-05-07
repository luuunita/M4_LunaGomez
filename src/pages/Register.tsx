import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/Authenticator';
import { getAuthErrorMessage } from '../features/auth/authErrors';


interface RegisterFormState {
  email: string;
  password: string;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

const initialRegisterForm: RegisterFormState = {
  email: '',
  password: '',
};

function validateRegister(form: RegisterFormState): FieldErrors<RegisterFormState> {
  const errors: FieldErrors<RegisterFormState> = {};

  if (!form.email.trim() || !form.email.includes('@') || !form.email.includes('.')) {
    errors.email = 'Ingresa un email valido.';
  }

  if (!form.password.trim() || form.password.length < 6) {
    errors.password = 'La contrasena debe tener al menos 6 caracteres.';
  }

  return errors;
}

function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [form, setForm] = useState<RegisterFormState>(initialRegisterForm);
  const [errors, setErrors] = useState<FieldErrors<RegisterFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validation = validateRegister(form);
    setErrors(validation);
    setSubmitError(null);

    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp(form.email, form.password);
      setForm(initialRegisterForm);
      navigate('/tasks', { replace: true });
    } catch (error) {
        setSubmitError(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Registro</h1>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo electronico"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'register-email-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.email && <p id="register-email-error">{errors.email}</p>}

        <label htmlFor="password">Contrasena</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contrasena"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'register-password-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.password && <p id="register-password-error">{errors.password}</p>}

        {submitError && <div role="alert">{submitError}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>
    </section>
  );
}

export default Register;
