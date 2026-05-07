import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
    errors.email = 'Ingresa un email válido.';
  }

  if (!form.password.trim() || form.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
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
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-copy">
          <p className="auth-eyebrow">Acceso seguro</p>
          <h1>Iniciar sesión</h1>
          <p className="auth-subtitle">
            Accede a tu cuenta para gestionar tus tareas con una experiencia clara
            y enfocada.
          </p>

          {state?.from && (
            <p className="auth-helper">
              Necesitas iniciar sesión para acceder a {state.from.pathname}
            </p>
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="alguien@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="field-message error-text" id="email-error">
              {errors.email}
            </p>
          )}

          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="field-message error-text" id="password-error">
              {errors.password}
            </p>
          )}

          {submitError && (
            <div className="status-banner error-banner" role="alert">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <p className="success-text" role="status">
              Acceso concedido.
            </p>
          )}

          <button className="auth-primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Iniciando sesión...' : 'Ingresar'}
          </button>

          <div className="auth-divider">
            <span>o continúa con</span>
          </div>

          <button
            className="google-button"
            type="button"
            onClick={() => void handleGoogleLogin()}
            disabled={isSubmitting}
          >
            <span className="google-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img" focusable="false">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.14 3.57-8.64Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-3c-1.07.72-2.44 1.15-4.08 1.15-3.14 0-5.8-2.12-6.75-4.96H1.25v3.09A12 12 0 0 0 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.25 14.28A7.2 7.2 0 0 1 4.87 12c0-.79.14-1.56.38-2.28V6.63H1.25A12 12 0 0 0 0 12c0 1.94.46 3.78 1.25 5.37l4-3.09Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.15 15.23 0 12 0A12 12 0 0 0 1.25 6.63l4 3.09c.95-2.84 3.61-4.95 6.75-4.95Z"
                />
              </svg>
            </span>
            <span>Google</span>
          </button>

          <p className="auth-footer">
            ¿Sin cuenta? <Link to="/register">Crea una</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;

