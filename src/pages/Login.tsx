import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/Authenticator';
import { getAuthErrorMessage } from '../features/auth/authErrors';


interface LoginFormState {
  email: string;
  password: string;
}

type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface LocationState {
  from?: {
    pathname: string;
  };
}

const initialLoginForm: LoginFormState = {
  email: '',
  password: '',
};

function validateLogin(form: LoginFormState): FieldErrors<LoginFormState> {
  const errors: FieldErrors<LoginFormState> = {};

  if (!form.email.trim() || !form.email.includes('@') || !form.email.includes('.')) {
    errors.email = 'Ingresa un email valido.';
  }

  if (!form.password.trim() || form.password.length < 6) {
    errors.password = 'La contrasena debe tener al menos 6 caracteres.';
  }

  return errors;
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  const state = location.state as LocationState | null;

  const [form, setForm] = useState<LoginFormState>(initialLoginForm);
  const [errors, setErrors] = useState<FieldErrors<LoginFormState>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const validation = validateLogin(form);
    setErrors(validation);
    setSubmitError(null);
    setSubmitSuccess(false);

    if (Object.keys(validation).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      await signIn(form.email, form.password);

      setSubmitSuccess(true);
      setForm(initialLoginForm);

      const destination = state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (error) {
      setSubmitError(getAuthErrorMessage(error));

    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleLogin(): Promise<void> {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      await signInWithGoogle();

      setSubmitSuccess(true);

      const destination = state?.from?.pathname || '/';
      navigate(destination, { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Error inesperado.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Iniciar sesion</h1>

      {state?.from && (
        <p>Necesitas iniciar sesion para acceder a {state.from.pathname}</p>
      )}

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
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.email && <p id="email-error">{errors.email}</p>}

        <label htmlFor="password">Contrasena</label>
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contrasena"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'password-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.password && <p id="password-error">{errors.password}</p>}

        {submitError && <div role="alert">{submitError}</div>}

        {submitSuccess && <p role="status">Acceso concedido.</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Iniciando sesion...' : 'Iniciar sesion'}
        </button>

        <button
          type="button"
          onClick={() => void handleGoogleLogin()}
          disabled={isSubmitting}
        >
          Entrar con Google
        </button>
      </form>
    </section>
  );
}

export default Login;

